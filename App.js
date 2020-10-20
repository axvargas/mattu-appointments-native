import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	FlatList,
	ScrollView,
	TouchableHighlight,
	Platform
} from 'react-native';
import Appointment from './components/Appointment';
import Form from './components/Form';
import AsyncStorage from '@react-native-community/async-storage'

const App = () => {
	// const isHermes = () => !!global.HermesInternal;
	// console.log(isHermes())
	const [showForm, setshowForm] = useState(false)
	const [appointments, setAppointments] = useState([])

	useEffect(() => {
		try {
			getFromStorage()
		} catch (error) {
			console.log(error)
		}
	}, [])
	const deleteAppointment = (id) => {
		const filteredAppointments = appointments.filter(appointment => appointment.id !== id)
		setAppointments(filteredAppointments)
		saveToStorage(JSON.stringify(filteredAppointments))
	}

	const closeForm = () => {
		setshowForm(false)
	}

	const saveToStorage = async (appointmentsJSON) => {
		try {
			await AsyncStorage.setItem('appointments', appointmentsJSON)
		} catch (error) {
			console.log(error)
		}
	}

	const getFromStorage = async () => {
		try {
			const savedAppointments = await AsyncStorage.getItem('appointments')
			if (savedAppointments) {
				setAppointments(JSON.parse(savedAppointments))
			}
		} catch (error) {
			console.log(error)
		}
	}

	return (
		<View style={styles.ctnHeader}>
			<Text style={styles.header}>Pet appointments</Text>
			<View>
				<TouchableHighlight
					style={styles.btnNewAppointment}
					onPress={() => setshowForm(!showForm)}
				>
					<Text style={styles.txtButton}>{!showForm ? "New appointment" : "Cancel new appointment"}</Text>
				</TouchableHighlight>
			</View>
			<View style={styles.content}>
				{showForm ?
					<>
						<Text style={styles.subheaderOne}>Create a new appointment</Text>
						<ScrollView>
							<Form setAppointments={setAppointments} appointments={appointments} closeForm={closeForm} saveToStorage={saveToStorage} />
						</ScrollView>
					</>
					:
					<>
						<Text style={styles.subheader}>{appointments.length > 0 ? 'Manage your appointments' : "There aren't appointmets yet"}</Text>
						<FlatList
							data={appointments}
							renderItem={({ item: appointment }) => (
								<Appointment appointment={appointment} deleteAppointment={deleteAppointment} />
							)}
							keyExtractor={(appointment) => appointment.id}
							style={styles.list}
						/>
					</>
				}
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	header: {
		color: '#FFF',
		marginTop: Platform.OS === 'ios' ? 24 : 4,
		fontSize: 24,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	subheaderOne: {
		color: '#FFF',
		marginBottom: 6,
		fontSize: 16,
		textAlign: 'center',
		fontWeight: 'normal',
		fontWeight: 'bold'

	},
	subheader: {
		color: '#FFF',
		marginBottom: 6,
		fontSize: 16,
		textAlign: 'center',
		fontWeight: 'bold'
	},
	ctnHeader: {
		backgroundColor: '#AA0768',
		flex: 1
	},
	content: {
		flex: 1,
		marginHorizontal: 10
	},
	list: {
		flex: 1
	},
	btnNewAppointment: {
		padding: 10,
		marginVertical: 10,
		backgroundColor: '#B24585'
	},
	txtButton: {
		color: '#FFF',
		textAlign: 'center'
	}
})

export default App