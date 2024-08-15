import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ScrollView, Pressable, Modal } from 'react-native';
import QuizzCom from '@/components/QuizzCom';
import Timer from '@/components/Timer';

const ITEMS_PER_PAGE = 1;

export default function Quizz() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [score, setScore] = useState(0);
  const [data, setData] = useState<{ question: string; choices: string[]; correctAnswer: string }[]>([]);

  useEffect(() => {
    const fetchFileContent = async () => {
      try {
        const response = await fetch('/test.txt'); // Adjust the path as needed
        if (response.ok) {
          const content = await response.text();
          const parsedData = parseQuizData(content);
          setData(parsedData);

          console.log(parsedData);
          
          setSelectedAnswers(Array(parsedData.length).fill(null));
        } else {
          console.error('Failed to fetch file:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching file:', error);
      }
    };

    fetchFileContent();
  }, []);

  const parseQuizData = (content: string) => {
    const lines = content.split('\n');
    const quizData = [];
    let currentQuestion = '';
    let choices = [];
    let correctAnswer = '';
  
    lines.forEach((line) => {
      line = line.trim();

      if (line.startsWith('$Q: ')) {
        if (currentQuestion) {
          quizData.push({
            question: currentQuestion,
            choices: [...choices],  // ensure a new array is pushed
            correctAnswer,
          });
          choices = [];
          correctAnswer = '';
        }
        currentQuestion = line.substring(4);
      } else if (line.startsWith('$A: ')) {
        choices.push(line.substring(4));
      } else if (line.startsWith('$C: ')) {

        correctAnswer = line.substring(4);
      }
    });
  
    // Push the last question after the loop ends
    if (currentQuestion) {
      quizData.push({
        question: currentQuestion,
        choices: [...choices],  // ensure a new array is pushed
        correctAnswer,
      });
    }
  
    return quizData;
  };
  

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

  const calculateScore = () => {
    const totalScore = selectedAnswers.reduce((acc, answer, index) => {
      return answer === data[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    setScore(totalScore);
  };

  const handleSubmit = () => {
    calculateScore();
    setIsModalVisible(true);
  };

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

      <Pressable
        style={selectedAnswers.some((element) => element === null) ? styles.disableButton : styles.button}
        disabled={selectedAnswers.some((element) => element === null)}
        onPress={handleSubmit}
      >
        <Text style={styles.buttonText}>Submit</Text>
      </Pressable>

      <Timer />

      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Quiz Score</Text>
            <Text style={styles.modalText}>You scored {score} out of {data.length}</Text>
            <Pressable style={styles.modalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.modalButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 14,
  },
});
