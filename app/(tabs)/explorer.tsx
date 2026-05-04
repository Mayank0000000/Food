import { CategoryTabs } from '@/components/menu/category-tabs';
import { FilterChips } from '@/components/menu/filter-chips';
import { FilterModal } from '@/components/menu/filter-modal';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItemDetailModal } from '@/components/menu/menu-item-detail-modal';
import { RView } from '@/components/ui/rview';
import { SearchInput } from '@/components/ui/search-input';
import { MenuListSkeleton } from '@/components/ui/skeleton';
import { useCMS } from '@/hooks/useCMS';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMenu } from '@/store/slices/menuSlice';
import { explorerStyles } from '@/styles/screens/explorer.styles';
import { FilterState } from '@/types/components/filter-chips.types';
import { GroupedMenu, MenuItem } from '@/types/menu.types';
import { applyMenuFilters, groupMenuByCategory } from '@/utils/menuFilters';
import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Explorer() {
  const { t } = useCMS();
  const dispatch = useAppDispatch();
  const { items: menuItems, isLoading } = useAppSelector((state) => state.menu);
  
  const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(t('explorer.allCategory'));
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    veg: null,
    hasOffers: false,
    sortBy: 'relevance',
    minRating: null,
  });

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch]);

  useEffect(() => {
    if (menuItems.length > 0) {
      const grouped = groupMenuByCategory(menuItems);
      setGroupedMenu(grouped);
      
      const uniqueCategories = [t('explorer.allCategory'), ...Object.keys(grouped)];
      setCategories(uniqueCategories);
    }
  }, [menuItems, t]);

  const getFilteredItems = (): MenuItem[] => {
    let items: MenuItem[] = [];
    
    if (selectedCategory === t('explorer.allCategory')) {
      items = menuItems;
    } else {
      items = groupedMenu[selectedCategory] || [];
    }

    return applyMenuFilters(items, filters, searchQuery);
  };

  const getItemCounts = () => {
    const counts: { [key: string]: number } = {
      [t('explorer.allCategory')]: applyMenuFilters(menuItems, filters, searchQuery).length,
    };
    Object.keys(groupedMenu).forEach((category) => {
      counts[category] = applyMenuFilters(groupedMenu[category], filters, searchQuery).length;
    });
    return counts;
  };

  const handleItemPress = (item: MenuItem) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={explorerStyles.container}>
        <RView style={explorerStyles.searchContainer}>
          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder={t('explorer.searchPlaceholder')}
          />
        </RView>
        <MenuListSkeleton count={6} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={explorerStyles.container}>
      <RView style={explorerStyles.searchContainer}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t('explorer.searchPlaceholder')}
        />
      </RView>

      <CategoryTabs
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        itemCounts={getItemCounts()}
      />
      
      <FilterChips
        activeFilters={filters}
        onOpenModal={() => setShowFilterModal(true)}
      />
      
      <FlatList
        data={getFilteredItems()}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <MenuItemCard item={item} onPress={() => handleItemPress(item)} />
        )}
        contentContainerStyle={explorerStyles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        activeFilters={filters}
        onApplyFilters={setFilters}
      />

      <MenuItemDetailModal
        visible={showDetailModal}
        item={selectedItem}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedItem(null);
        }}
      />
    </SafeAreaView>
  );
}