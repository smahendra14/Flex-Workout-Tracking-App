import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Dropdown } from 'react-native-element-dropdown';


// data for dropdown component 
const muscleGroupData = [
    { label: 'Chest', value: 'chest' }, 
    { label: 'Shoulders', value: 'shoulders' },
    { label: 'Triceps', value: 'triceps' },
    { label: 'Back', value: 'back' },
    { label: 'Biceps', value: 'biceps' },
    { label: 'Quads', value: 'quads' },
    { label: 'Hamstrings', value: 'hamstrings' },
    { label: 'Calves', value: 'calves' },
    { label: 'Other', value: 'other' },
];

// props interface 
interface DropdownComponentProps {
    setIsMuscleSelected: (isSelected: boolean) => void;
    setMuscleGroup: (muscleGroup: string) => void;
}

const DropdownComponent: React.FC<DropdownComponentProps> = ({ setIsMuscleSelected, setMuscleGroup }) => {

    const [value, setValue] = useState(null);

    const renderItem = item => {
      return (
        <View style={styles.item}>
          <Text style={styles.textItem}>{item.label}</Text>
          {item.value === value}
        </View>
      );
    };

    return (
        <Dropdown
          style={styles.dropdown}
          placeholderStyle={styles.placeholderStyle}
          selectedTextStyle={styles.selectedTextStyle}
          inputSearchStyle={styles.inputSearchStyle}
          data={muscleGroupData}
          search
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder="Select muscle group"
          searchPlaceholder="Search muscle group..."
          value={value}
          onChange={item => {
            setValue(item.value);
            setIsMuscleSelected(true);
            setMuscleGroup(item.value)
          }}
        //   renderLeftIcon={() => (
        //     <AntDesign style={styles.icon} color="black" name="Safety" size={20} />
        //   )}
          renderItem={renderItem}
        />
      );
}

export default DropdownComponent;

const styles = StyleSheet.create({
    dropdown: {
        margin: 16,
        height: 55,
        backgroundColor: '#D9D9D9',
        padding: 12,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    textItem: {
        flex: 1,
        fontSize: 16,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 16,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
})

