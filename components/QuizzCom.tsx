import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

interface Question {
  question: string;
  choices: string[];
}

interface QuizzProps {
  question: Question;
  selectedAnswer: string | null;
  setSelectedAnswer: (answer: string) => void;
}

const QuizzCom: React.FC<QuizzProps> = ({ question, selectedAnswer, setSelectedAnswer }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.questionText}>{question.question}</Text>
      {question.choices.map((choice, index) => (
        <Pressable
          key={index}
          style={[
            styles.choiceButton,
            selectedAnswer === choice && styles.selectedChoiceButton,
          ]}
          onPress={() => setSelectedAnswer(choice)}
        >
          <Text style={styles.choiceText}>
            {String.fromCharCode(65 + index)}. {choice}
          </Text>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  choiceButton: {
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  selectedChoiceButton: {
    backgroundColor: '#ff0000',
  },
  choiceText: {
    fontSize: 16,
    color: '#fff',
  },
});

export default QuizzCom;
