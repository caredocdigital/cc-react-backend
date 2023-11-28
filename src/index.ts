
import express, { Request, Response } from 'express';
import storage from './storage';

// Define the patient type
interface Patient {
    id: number;
    firstName: string;
    lastName: string;
    birthDate: string;
}

// Initialize the Express app
const app = express();
app.use(express.json());

// Endpoint to list all patients
app.get('/patients', (req: Request, res: Response) => {
    res.json(storage.fetchData());
});

// Endpoint to create a new patient
app.post('/patients', (req: Request, res: Response) => {
    const { firstName, lastName, birthDate } = req.body;

    const patients = storage.fetchData() as Patient[];

    // Generate a unique ID for the new patient
    const id = patients.length + 1;

    // Create the new patient object
    const newPatient: Patient = {
        id,
        firstName,
        lastName,
        birthDate,
    };

    // Add the new patient to the in-memory storage
    const nextPatients = patients.push(newPatient);

    storage.storeData(nextPatients);

    res.status(201).json(newPatient);
});

// Endpoint to delete a patient by ID
app.delete('/patients/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);

    const patients = storage.fetchData() as Patient[];

    // Find the index of the patient with the given ID
    const index = patients.findIndex((patient) => patient.id === id);

    if (index !== -1) {
        // Remove the patient from the in-memory storage
        const nextPatients = patients.splice(index, 1);
        storage.storeData(nextPatients);
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// Endpoint to update a patient by ID
app.put('/patients/:id', (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const { firstName, lastName, birthDate } = req.body;

    const patients = storage.fetchData() as Patient[];

    // Find the patient with the given ID
    const patient = patients.find((patient) => patient.id === id);

    if (patient) {
        // Update the patient's information
        patient.firstName = firstName;
        patient.lastName = lastName;
        patient.birthDate = birthDate;

        const nextPatients = patients;
        storage.storeData(nextPatients);

        res.json(patient);
    } else {
        res.sendStatus(404);
    }
});

// Start the server
const port = 3005;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
