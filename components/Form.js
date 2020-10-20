import React, { useState, useRef } from 'react'
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
    Button,
    Alert,
    TouchableHighlight
} from 'react-native'
import DateTimePickerModal from "react-native-modal-datetime-picker"
import { useForm, Controller } from 'react-hook-form'
import shortid from 'shortid'

const phoneRegExp = /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/

const Form = ({ setAppointments, appointments, closeForm, saveToStorage }) => {
    const [selectedDate, setSelectedDate] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false)
    const [isTimePickerVisible, setTimePickerVisibility] = useState(false)

    const { control, handleSubmit, errors, setError, clearErrors } = useForm();

    const petRef = useRef()
    const ownerRef = useRef()
    const symptomsRef = useRef()
    const telephoneRef = useRef()

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirmDate = (date) => {
        const options = { year: 'numeric', month: 'long', day: '2-digit' }
        setSelectedDate(date.toLocaleDateString('en-GB', options));
        clearErrors("date")
        hideDatePicker();
    };

    const showTimePicker = () => {
        setTimePickerVisibility(true);
    };

    const hideTimePicker = () => {
        setTimePickerVisibility(false);
    };

    const handleConfirmTime = (time) => {
        const options = { hour: 'numeric', minute: '2-digit' }
        setSelectedTime(time.toLocaleTimeString('en-GB', options));
        clearErrors("time")
        hideTimePicker();
    };

    const onSubmit = async (data) => {
        if (!selectedDate) {
            setError("date", { type: "validate", message: "Select the date please" })
            onError({ date: { message: "Select the date please" } });
            return
        } if (!selectedTime) {
            setError("time", { type: "validate", message: "Select the time please" })
            onError({ time: { message: "Select the time please" } });
            return
        }

        const appointment = {
            ...data,
            date: selectedDate,
            time: selectedTime
        }
        appointment.id = shortid.generate()
        const newAppointments = [appointment, ...appointments]
        setAppointments(newAppointments)

        // * SAVE THEM TO STORAGE 
        saveToStorage(JSON.stringify(newAppointments))
        setSelectedDate(null)
        setSelectedTime(null)

        closeForm()
    }

    const onError = (errors) => {
        console.log("ERRORS", errors);
        const { pet, owner, telephone, symptoms, time, date } = errors;
        if (pet) {
            showAlert(pet.message)
        } else if (owner) {
            showAlert(owner.message)
        } else if (telephone) {
            showAlert(telephone.message)
        } else if (date) {
            showAlert(date.message)
        } else if (time) {
            showAlert(time.message)
        } else if (symptoms) {
            showAlert(symptoms.message)
        }
    }

    const showAlert = (message) => {
        Alert.alert(
            "Error",
            message,
            [{
                text: "OK",
                onPress: () => {
                    clearErrors("time")
                    clearErrors("date")
                }
            }],
            { cancelable: false }
        )
    }

    return (
        <>
            <View style={styles.form}>
                <View>
                    <Text style={styles.txtLabel}>Pet: </Text>
                    <Controller
                        name="pet"
                        control={control}
                        defaultValue=""
                        onFocus={() => {
                            petRef.current.focus();
                        }}
                        rules={{
                            required: "Type the pet's name please",
                            validate: (value) => value.trim() !== '' || "Type the pet's name please"
                        }}
                        render={({ onChange, onBlur, value }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                ref={petRef}
                            />
                        )}
                    />
                </View>
                <View>
                    <Text style={styles.txtLabel}>Owner: </Text>
                    <Controller
                        name="owner"
                        control={control}
                        defaultValue=""
                        onFocus={() => {
                            ownerRef.current.focus();
                        }}
                        rules={{
                            required: "Type the owner's name please",
                            validate: (value) => value.trim() !== '' || "Type the owner's name please"
                        }}
                        render={({ onChange, onBlur, value }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                ref={ownerRef}
                            />
                        )}
                    />
                </View>
                <View>
                    <Text style={styles.txtLabel}>Telephone: </Text>
                    <Controller
                        name="telephone"
                        control={control}
                        defaultValue=""
                        onFocus={() => {
                            telephoneRef.current.focus();
                        }}
                        rules={{
                            required: "Type the telephone please",
                            validate: (value) => value.trim() !== '' || "Type the telephone please",
                            pattern: {
                                value: phoneRegExp,
                                message: "Type a valid telephone please"
                            }
                        }}
                        render={({ onChange, onBlur, value }) => (
                            <TextInput
                                style={styles.input}
                                onChangeText={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                ref={telephoneRef}
                            />
                        )}
                    />
                </View>

                <View>
                    <Text style={styles.txtLabel}>Date: </Text>
                    <View>
                        <TouchableHighlight
                            style={styles.viewBtnSelect}
                            onPress={showDatePicker}
                        >
                            <Text style={styles.txtButtonSelect}>Select the date</Text>
                        </TouchableHighlight>
                    </View>
                    <DateTimePickerModal
                        isVisible={isDatePickerVisible}
                        mode="date"
                        locale="en-GB"
                        onConfirm={handleConfirmDate}
                        onCancel={hideDatePicker}
                    />
                    <Text>{selectedDate}</Text>
                </View>
                <View>
                    <Text style={styles.txtLabel}>Time: </Text>
                    <View>
                        <TouchableHighlight
                            style={styles.viewBtnSelect}
                            onPress={showTimePicker}
                        >
                            <Text style={styles.txtButtonSelect}>Select the time</Text>
                        </TouchableHighlight>
                    </View>
                    <DateTimePickerModal
                        isVisible={isTimePickerVisible}
                        mode="time"
                        locale="en-GB"
                        onConfirm={handleConfirmTime}
                        onCancel={hideTimePicker}
                    />
                    <Text>{selectedTime}</Text>
                </View>
                <View>
                    <Text style={styles.txtLabel}>Symptoms: </Text>
                    <Controller
                        name="symptoms"
                        control={control}
                        defaultValue=""
                        onFocus={() => {
                            symptomsRef.current.focus();
                        }}
                        rules={{
                            required: "Type the symptoms please",
                            validate: (value) => value.trim() !== '' || "Type the symptoms please"
                        }}
                        render={({ onChange, onBlur, value }) => (
                            <TextInput
                                multiline
                                style={styles.input}
                                onChangeText={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                ref={symptomsRef}
                            />
                        )}
                    />
                </View>
                <View>
                    <TouchableHighlight
                        style={styles.viewBtnSubmit}
                        onPress={handleSubmit(onSubmit, onError)}
                    >
                        <Text style={styles.txtButton}>Save</Text>
                    </TouchableHighlight>
                </View>

            </View >
        </>
    )
}

export default Form

const styles = StyleSheet.create({
    form: {
        flex: 1,
        backgroundColor: '#FFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    txtLabel: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    input: {
        marginBottom: 15,
        height: 38,
        borderColor: '#E1E1E1',
        borderWidth: 1,
        borderStyle: 'solid',
        backgroundColor: '#F2F2F2',
        color: 'black'
    },
    viewBtnSelect: {
        padding: 10,
        backgroundColor: '#6b6b6b'
    },
    txtButtonSelect: {
        color: '#FFF',
        textAlign: 'center'
    },
    viewBtnSubmit: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#B24585'
    },
    txtButton: {
        color: '#FFF',
        textAlign: 'center'
    }
})
