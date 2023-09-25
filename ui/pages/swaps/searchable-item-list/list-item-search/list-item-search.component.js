import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Fuse from 'fuse.js';
import log from 'loglevel';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '../../../../components/ui/text-field';
import { usePrevious } from '../../../../hooks/usePrevious';
import { isValidHexAddress } from '../../../../../shared/modules/hexstring-utils';
import { fetchToken } from '../../swaps.util';
import { getCurrentChainId } from '../../../../selectors/selectors';

const renderAdornment = () => (
  <InputAdornment position="start" style={{ marginRight: '12px' }}>
    <img src="images/search.svg" width="17" height="17" alt="" />
  </InputAdornment>
);

export default function ListItemSearch({
  onSearch,
  error,
  listToSearch = [],
  fuseSearchKeys,
  searchPlaceholderText,
  defaultToAll,
  shouldSearchForImports,
}) {
  const fuseRef = useRef();
  const [searchQuery, setSearchQuery] = useState('');
  const chainId = useSelector(getCurrentChainId);

  /**
   * Search a custom token for import based on a contract address.
   * @param {String} contractAddress
   */
  const handleSearchTokenForImport = async (contractAddress) => {
    setSearchQuery(contractAddress);
    try {
      const token = await fetchToken(contractAddress, chainId);
      if (token) {
        token.primaryLabel = token.symbol;
        token.secondaryLabel = token.name;
        token.notImported = true;
        onSearch({
          searchQuery: contractAddress,
          results: [token],
        });
        return;
      }
    } catch (e) {
      log.error('Token not found, show 0 results.', e);
    }
    onSearch({
      searchQuery: contractAddress,
      results: [], // No token for import found.
    });
  };

  const handleSearch = async (newSearchQuery) => {
    const trimmedNewSearchQuery = newSearchQuery.trim();
    const validHexAddress = isValidHexAddress(trimmedNewSearchQuery);
    const fuseSearchResult = fuseRef.current.search(newSearchQuery);
    const results =
      defaultToAll && newSearchQuery === '' ? listToSearch : fuseSearchResult;
    if (shouldSearchForImports && results.length === 0 && validHexAddress) {
      await handleSearchTokenForImport(trimmedNewSearchQuery);
      return;
    }
    setSearchQuery(newSearchQuery);
    onSearch({
      searchQuery: newSearchQuery,
      results,
    });
  };

  useEffect(() => {
    if (!fuseRef.current) {
      fuseRef.current = new Fuse(listToSearch, {
        shouldSort: true,
        threshold: 0.45,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: fuseSearchKeys,
      });
    }
  }, [fuseSearchKeys, listToSearch]);

  const previousListToSearch = usePrevious(listToSearch ?? []);
  useEffect(() => {
    if (
      fuseRef.current &&
      searchQuery &&
      previousListToSearch !== listToSearch
    ) {
      fuseRef.current.setCollection(listToSearch);
      const fuseSearchResult = fuseRef.current.search(searchQuery);
      onSearch({ searchQuery, results: fuseSearchResult });
    }
  }, [listToSearch, searchQuery, onSearch, previousListToSearch]);

  return (
    <TextField
      data-testid="search-list-items"
      className="searchable-item-list__search"
      placeholder={searchPlaceholderText}
      type="text"
      value={searchQuery}
      onChange={(e) => handleSearch(e.target.value)}
      error={error}
      fullWidth
      startAdornment={renderAdornment()}
      autoComplete="off"
      autoFocus
    />
  );
}

ListItemSearch.propTypes = {
  onSearch: PropTypes.func,
  error: PropTypes.string,
  listToSearch: PropTypes.array.isRequired,
  fuseSearchKeys: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchPlaceholderText: PropTypes.string,
  defaultToAll: PropTypes.bool,
  shouldSearchForImports: PropTypes.bool,
};
