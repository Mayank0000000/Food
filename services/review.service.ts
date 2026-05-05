import { ENV } from '@/config/env';
import { API_ENDPOINTS } from '@/lib/api-endpoints';
import { Review } from '@/types/menu.types';

const MAX_RETRIES = 3;

class ReviewService {
  private async getFileContent(filePath: string) {
    const response = await fetch(
      `${ENV.GITHUB_API_BASE_URL}${API_ENDPOINTS.getFileUrl(filePath)}`,
      {
        headers: {
          Authorization: `token ${ENV.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch file: ${response.status}`);
    }

    const data = await response.json();
    return {
      content: JSON.parse(atob(data.content)),
      sha: data.sha,
    };
  }

  private async updateFileContent(
    filePath: string,
    content: any,
    sha: string,
    message: string
  ) {
    const response = await fetch(
      `${ENV.GITHUB_API_BASE_URL}${API_ENDPOINTS.getFileUrl(filePath)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${ENV.GITHUB_TOKEN}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
          sha,
        }),
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      const error: any = new Error(err.message || 'Failed to update file');
      error.status = response.status;
      throw error;
    }

    return await response.json();
  }

  async submitReview(
    menuItemId: number,
    userId: string,
    userName: string,
    rating: number,
    feedback: string,
    menuItemName?: string  // fallback for old orders with timestamp IDs
  ): Promise<void> {
    let lastError: any;

    for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
      try {
        // Fetch feedback.json file
        const { content: feedbackData, sha } = await this.getFileContent(
          API_ENDPOINTS.FILES.FEEDBACK
        );

        // Create new review with unique ID
        const review: Review = {
          id: `${userId}_${menuItemId}_${Date.now()}`,
          menuItemId,
          userId,
          userName,
          rating,
          feedback,
          createdAt: new Date().toISOString(),
        };

        // Add review to feedback array
        const updatedFeedback = Array.isArray(feedbackData) ? [...feedbackData, review] : [review];

        // Update feedback.json file
        await this.updateFileContent(
          API_ENDPOINTS.FILES.FEEDBACK,
          updatedFeedback,
          sha,
          `Add review for item ${menuItemId} by ${userName}`
        );

        return; // success
      } catch (error: any) {
        lastError = error;

        if (error.status === 409 && attempt < MAX_RETRIES - 1) {
          console.log(`⚠️ Review conflict, retrying (${attempt + 1}/${MAX_RETRIES})...`);
          await new Promise(resolve => setTimeout(resolve, 600 * (attempt + 1)));
          continue;
        }

        // Non-409 or max retries reached
        break;
      }
    }

    console.error('Error submitting review:', lastError);
    throw lastError;
  }

  async getMenuItemReviews(menuItemId: number): Promise<Review[]> {
    try {
      const { content: feedbackData } = await this.getFileContent(
        API_ENDPOINTS.FILES.FEEDBACK
      );

      if (!Array.isArray(feedbackData)) return [];

      // Filter reviews for this specific menu item
      return feedbackData.filter(
        (review: Review) => Number(review.menuItemId) === Number(menuItemId)
      );
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }
  }

  async hasUserReviewed(menuItemId: number, userId: string, menuItemName?: string): Promise<{ reviewed: boolean; rating: number }> {
    try {
      const { content: feedbackData } = await this.getFileContent(
        API_ENDPOINTS.FILES.FEEDBACK
      );

      if (!Array.isArray(feedbackData)) return { reviewed: false, rating: 0 };

      // Check if user has already reviewed this item
      const userReview = feedbackData.find(
        (review: Review) => 
          Number(review.menuItemId) === Number(menuItemId) && 
          review.userId === userId
      );

      return userReview
        ? { reviewed: true, rating: userReview.rating }
        : { reviewed: false, rating: 0 };
    } catch (error) {
      console.error('Error checking review status:', error);
      return { reviewed: false, rating: 0 };
    }
  }

  async getMenuItemStats(menuItemId: number): Promise<{ averageRating: number; totalReviews: number }> {
    try {
      const { content: feedbackData } = await this.getFileContent(
        API_ENDPOINTS.FILES.FEEDBACK
      );

      if (!Array.isArray(feedbackData)) return { averageRating: 0, totalReviews: 0 };

      // Filter reviews for this menu item
      const itemReviews = feedbackData.filter(
        (review: Review) => Number(review.menuItemId) === Number(menuItemId)
      );

      if (itemReviews.length === 0) return { averageRating: 0, totalReviews: 0 };

      const totalRating = itemReviews.reduce((sum: number, review: Review) => sum + review.rating, 0);
      const averageRating = totalRating / itemReviews.length;

      return {
        averageRating: Math.round(averageRating * 10) / 10, // Round to 1 decimal
        totalReviews: itemReviews.length,
      };
    } catch (error) {
      console.error('Error fetching menu item stats:', error);
      return { averageRating: 0, totalReviews: 0 };
    }
  }
}

export const reviewService = new ReviewService();
