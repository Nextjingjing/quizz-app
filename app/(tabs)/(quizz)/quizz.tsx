import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import QuizzCom from '@/components/QuizzCom';
import Timer from '@/components/Timer';
import { Link } from 'expo-router'; // Import Link
import questionsData from '@/assets/quizz.json'; // Import JSON file

const ITEMS_PER_PAGE = 1;

export default function Quizz() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  useEffect(() => {
    // Load data from JSON
    setData(questionsData);
    setSelectedAnswers(Array(questionsData.length).fill(null));
  }, []);

  const currentData = data.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);

  const handleAnswerSelect = (answer: string) => {
    const updatedAnswers = [...selectedAnswers];
    updatedAnswers[currentPage - 1] = answer;
    setSelectedAnswers(updatedAnswers);
  };

  useEffect(() => {
    console.log(selectedAnswers);
  }, [selectedAnswers]);

  return (
    <View style={styles.container}>
      <FlatList
        data={currentData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <QuizzCom
            question={item}
            selectedAnswer={selectedAnswers[currentPage - 1]}
            setSelectedAnswer={handleAnswerSelect}
          />
        )}
        ListFooterComponent={
          <View style={styles.paginationContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.paginationButtons}>
                {Array.from({ length: totalPages }, (_, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.pageButton,
                      currentPage === index + 1 && styles.activePageButton,
                    ]}
                    onPress={() => setCurrentPage(index + 1)}
                  >
                    <Text
                      style={[
                        styles.pageButtonText,
                        currentPage === index + 1 && styles.activePageButtonText,
                      ]}
                    >
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        }
      />
      
      <Link href="/result" asChild>
        <Pressable style={selectedAnswers.some(element => element === null)? styles.disableButton : styles.button } disabled={selectedAnswers.some(element => element === null)}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </Link>

      <Timer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  paginationContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  paginationButtons: {
    flexDirection: 'row',
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#007BFF',
  },
  pageButtonText: {
    fontSize: 16,
    color: '#fff',
  },
  activePageButton: {
    backgroundColor: '#0056b3',
  },
  activePageButtonText: {
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#28a745', 
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', 
    minWidth: 100, 
  },
  disableButton: {
    backgroundColor: 'gray',
    opacity: 0.35,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center', 
    minWidth: 100, 
  },
  buttonText: {
    color: '#fff', 
    fontSize: 16,
    textAlign: 'center', 
    fontWeight: 'bold',
  },
});

