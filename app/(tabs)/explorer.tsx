import { CategoryTabs } from '@/components/menu/category-tabs';
import { FilterChips } from '@/components/menu/filter-chips';
import { FilterModal } from '@/components/menu/filter-modal';
import { MenuItemCard } from '@/components/menu/menu-item-card';
import { MenuItemDetailModal } from '@/components/menu/menu-item-detail-modal';
import { RView } from '@/components/ui/rview';
import { SearchInput } from '@/components/ui/search-input';
import { MenuListSkeleton } from '@/components/ui/skeleton';
import { useCMS } from '@/hooks/useCMS';
import { useTheme } from '@/hooks/useTheme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearPendingFilters } from '@/store/slices/explorerSlice';
import { fetchMenu } from '@/store/slices/menuSlice';
import { createExplorerStyles } from '@/styles/screens/explorer.styles';
import { FilterState } from '@/types/components/filter-chips.types';
import { GroupedMenu, MenuItem } from '@/types/menu.types';
import { applyMenuFilters, groupMenuByCategory } from '@/utils/menuFilters';
import { useFocusEffect } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Explorer() {
  const { t, getLanguage } = useCMS();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const explorerStyles = useMemo(() => createExplorerStyles(theme), [theme]);
  const { items: menuItems, isLoading } = useAppSelector((state) => state.menu);
  const { pendingFilters, pendingCategory, pendingSearchQuery } = useAppSelector((state) => state.explorer);
  const currentLanguage = getLanguage();
  
  const [groupedMenu, setGroupedMenu] = useState<GroupedMenu>({});
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('explorer.allCategory'); // Use CMS key
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

  // Apply pending filters when screen is focused
  useFocusEffect(
    useCallback(() => {
      if (pendingFilters) {
        setFilters(pendingFilters);
        dispatch(clearPendingFilters());
      }
      if (pendingCategory) {
        setSelectedCategory(pendingCategory);
      }
      if (pendingSearchQuery) {
        setSearchQuery(pendingSearchQuery);
      }
    }, [pendingFilters, pendingCategory, pendingSearchQuery])
  );

  useEffect(() => {
    dispatch(fetchMenu());
  }, [dispatch, currentLanguage]);

  useEffect(() => {
    if (menuItems.length > 0) {
      const grouped = groupMenuByCategory(menuItems);
      setGroupedMenu(grouped);
      
      const uniqueCategories = ['explorer.allCategory', ...Object.keys(grouped)]; // Use CMS key
      setCategories(uniqueCategories);
    }
  }, [menuItems]);

  const getFilteredItems = (): MenuItem[] => {
    let items: MenuItem[] = [];
    
    if (selectedCategory === 'explorer.allCategory') { // Compare with CMS key
      items = menuItems;
    } else {
      items = groupedMenu[selectedCategory] || [];
    }

    return applyMenuFilters(items, filters, searchQuery);
  };

  const getItemCounts = () => {
    const counts: { [key: string]: number } = {
      'explorer.allCategory': applyMenuFilters(menuItems, filters, searchQuery).length, // Use CMS key
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