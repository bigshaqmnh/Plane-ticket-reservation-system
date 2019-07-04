import { useState, useEffect } from 'react';

function useFetchData(apiMethod) {
  const [items, setItems] = useState([]);
  const [itemsCount, setItemsCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [isLoading, setIsLoading] = useState(true);

  const [searchText, setSearchText] = useState('');

  const fetchData = async params => {
    try {
      const { data, count } = await apiMethod(params);

      setItems(data);
      setItemsCount(count);
      setIsLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    setIsLoading(true);

    fetchData({ page: currentPage, query: searchText });
  }, [searchText, currentPage]);

  return { items, setItems, itemsCount, isLoading, searchText, setSearchText, currentPage, setCurrentPage };
}

export default useFetchData;
