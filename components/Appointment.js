import React from 'react'
import {
    StyleSheet,
    Text,
    View,
    Button,
    TouchableHighlight
} from 'react-native'

const Appointment = ({ appointment, deleteAppointment }) => {
    const { id, pet, owner, symptoms } = appointment

    const showDeleteDialog = () => {
        console.log("Deleting... ", id)
        deleteAppointment(id)
    }
    return (
        <View style={styles.viewAppointment}>
            <View style={styles.viewInfo}>
                <Text style={styles.txtLabel}>Pet: </Text>
                <Text style={styles.txtInfo}>{pet}</Text>
            </View>
            <View>
                <Text style={styles.txtLabel}>Owner: </Text>
                <Text style={styles.txtInfo}>{owner}</Text>
            </View>
            <View>
                <Text style={styles.txtLabel}>Symptoms: </Text>
                <Text style={styles.txtInfo}>{symptoms}</Text>
            </View>
            <View>
                <TouchableHighlight
                    style={styles.btnDelete}
                    onPress={() => showDeleteDialog()}
                >
                    <Text style={styles.txtButton}>Delete</Text>
                </TouchableHighlight>
            </View>
        </View>
    )
}

export default Appointment

const styles = StyleSheet.create({
    viewAppointment: {
        backgroundColor: '#FFF',
        borderBottomColor: '#E1E1E1',
        borderStyle: 'solid',
        borderBottomWidth: 1,
        paddingVertical: 20,
        paddingHorizontal: 10
    },
    viewInfo: {
        display: 'flex'
    },
    txtLabel: {
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 20
    },
    txtInfo: {
        fontSize: 18,
    },
    btnDelete: {
        padding: 10,
        marginVertical: 10,
        backgroundColor: '#B24585'
    },
    txtButton: {
        color: '#FFF',
        textAlign: 'center'
    }
})
