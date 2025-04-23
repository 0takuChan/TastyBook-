import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';

interface Type {
  id: number;
  name: string;
}

interface MenuFormModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (menu: { name: string; ingredients: string; steps: string; typeId: string }) => void;
  initialData?: { name: string; ingredients: string; steps: string; typeId: string };
  title: string;
}

const MenuFormModal: React.FC<MenuFormModalProps> = ({ visible, onClose, onSave, initialData, title }) => {
  const [name, setName] = useState(initialData?.name || '');
  const [ingredients, setIngredients] = useState(initialData?.ingredients || '');
  const [steps, setSteps] = useState(initialData?.steps || '');
  const [typeId, setTypeId] = useState(initialData?.typeId || '');
  const [types, setTypes] = useState<Type[]>([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (initialData && visible) {
      setName(initialData.name);
      setIngredients(initialData.ingredients);
      setSteps(initialData.steps);
      setTypeId(initialData.typeId);
    }
  }, [initialData, visible]);

 
  useEffect(() => {
    if (!initialData && visible) {
      setName('');
      setIngredients('');
      setSteps('');
      setTypeId('');
    }
  }, [visible, initialData]);

  useEffect(() => {
    if (visible) {
      fetchTypes();
    }
  }, [visible]);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://10.0.2.2:5000/api/types');
      setTypes(res.data);
    } catch (err) {
      console.error('Error fetching types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    onSave({ name, ingredients, steps, typeId });
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={false} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
        </View>
        <ScrollView style={styles.modalContent}>
          <Text style={styles.label}>ชื่ออาหาร</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="ชื่ออาหาร" />

          <Text style={styles.label}>ส่วนผสม</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={ingredients}
            onChangeText={setIngredients}
            placeholder="ส่วนผสม (แยกด้วยการขึ้นบรรทัดใหม่)"
            multiline
          />

          <Text style={styles.label}>วิธีทำ</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            value={steps}
            onChangeText={setSteps}
            placeholder="วิธีทำ (แยกด้วยการขึ้นบรรทัดใหม่)"
            multiline
          />

          <Text style={styles.label}>ประเภทเมนู</Text>
          {loading ? (
            <ActivityIndicator size="large" color="#10B981" />
          ) : (
            <Picker
              selectedValue={typeId}
              onValueChange={(itemValue: string) => setTypeId(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="เลือกประเภท" value="" />
              {types.map((type) => (
                <Picker.Item key={type.id} label={type.name} value={type.id.toString()} />
              ))}
            </Picker>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelButtonText}>ยกเลิก</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>บันทึก</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#E6FFFA',
    paddingHorizontal: 16,
    paddingTop: 25,
  },
  modalHeader: {
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  modalContent: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#EF4444',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#EF4444',
    fontWeight: 'bold',
  },
  saveButton: {
    backgroundColor: '#34D399',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default MenuFormModal;
