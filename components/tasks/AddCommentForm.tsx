import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Button } from '@/components/ui/Button';
import { Send } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useThemeStore } from '@/store/themeStore';
import { useTasksStore } from '@/store/tasksStore';
import { useAuthStore } from '@/store/authStore';

interface AddCommentFormProps {
  taskId: string;
  onCommentAdded?: () => void;
}

export const AddCommentForm: React.FC<AddCommentFormProps> = ({ taskId, onCommentAdded }) => {
  const { theme } = useThemeStore();
  const colors = theme === 'light' ? Colors.light : Colors.dark;
  const { addComment, isLoading } = useTasksStore();
  const { user } = useAuthStore();

  const [comment, setComment] = useState('');

  const handleSubmit = async () => {
    if (!comment.trim() || !user) return;

    await addComment(taskId, user.id, comment.trim());
    setComment('');
    
    if (onCommentAdded) {
      onCommentAdded();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            backgroundColor: theme === 'light' ? '#F9FAFB' : '#1F2937',
            borderColor: colors.border,
          },
        ]}
        placeholder="Напишите комментарий..."
        placeholderTextColor={colors.secondary}
        value={comment}
        onChangeText={setComment}
        multiline
        textAlignVertical="top"
      />
      <Button
        title="Отправить"
        onPress={handleSubmit}
        variant="primary"
        size="small"
        isLoading={isLoading}
        disabled={!comment.trim()}
        leftIcon={<Send size={16} color="#FFFFFF" />}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 80,
    marginBottom: 12,
  },
  button: {
    alignSelf: 'flex-end',
  },
});