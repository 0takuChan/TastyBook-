// Pagination.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.pageButton, currentPage === 1 && styles.disabledButton]}
        onPress={() => currentPage > 1 && onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <Text style={styles.buttonText}>Previous</Text>
      </TouchableOpacity>

      <Text style={styles.pageText}>
        {currentPage} of {totalPages}
      </Text>

      <TouchableOpacity
        style={[styles.pageButton, currentPage === totalPages && styles.disabledButton]}
        onPress={() => currentPage < totalPages && onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <Text style={styles.buttonText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  pageButton: {
    backgroundColor: '#34D399',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  disabledButton: {
    backgroundColor: '#D1D1D1',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
  pageText: {
    fontSize: 16,
    color: '#000',
  },
});

export default Pagination;
