import { useState } from "react";
import {
  Plus,
  Search,
  User,
  Calendar,
  FileText,
  Phone,
  Mail,
} from "lucide-react";

type Patient = {
  id: string;
  name: string;
  dateOfBirth: string;
  phone: string;
  email: string;
  address: string;
  allergies: string[];
  conditions: string[];
  prescriptionHistory: {
    id: string;
    date: string;
    doctor: string;
    medications: string[];
    status: string;
  }[];
};

export function PatientRecords({ user }: { user: any }) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] =
    useState<Patient | null>(null);

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "PT-45678",
      name: "Novak Janez",
      dateOfBirth: "1985-03-15",
      phone: "+1 (555) 123-4567",
      email: "novakjanez@email.com",
      address: "Prisoje 9, Koper 6000",
      allergies: ["Penicillin", "Sulfa drugs"],
      conditions: ["Hypertension", "Type 2 Diabetes"],
      prescriptionHistory: [
        {
          id: "RX-2024-1234",
          date: "2024-12-01",
          doctor: "Dr. Vangel Markovski",
          medications: ["Amoxicillin 500mg", "Ibuprofen 400mg"],
          status: "Pending",
        },
      ],
    },
  ]);

  const emptyPatientForm = {
    name: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    allergies: "",
    conditions: "",
  };

  const [newPatient, setNewPatient] = useState(emptyPatientForm);

  const filteredPatients = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.phone.includes(searchQuery)
  );

  const calculateAge = (dob: string) => {
    if (!dob) return "N/A";

    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) {
      return "N/A";
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleCreatePatient = () => {
    if (!newPatient.name.trim()) {
      alert("Please enter patient name.");
      return;
    }

    if (!newPatient.dateOfBirth) {
      alert("Please enter patient date of birth.");
      return;
    }

    const patient: Patient = {
      id: `PT-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newPatient.name,
      dateOfBirth: newPatient.dateOfBirth,
      phone: newPatient.phone,
      email: newPatient.email,
      address: newPatient.address,
      allergies: newPatient.allergies.trim()
        ? newPatient.allergies.split(",").map((a) => a.trim())
        : ["None known"],
      conditions: newPatient.conditions.trim()
        ? newPatient.conditions.split(",").map((c) => c.trim())
        : [],
      prescriptionHistory: [],
    };

    setPatients((prev) => [...prev, patient]);
    setNewPatient(emptyPatientForm);
    setShowAddModal(false);
    alert("Patient created successfully!");
  };

  return (
    <div className="space-y-6">
      <div style={{ float: "right" }}>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      <div>
        <h1>Patient Records</h1>
        <p className="text-gray-600 mt-1">
          Access patient medical history and prescription records
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by patient ID, name, email, or phone"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Patient List */}
      <div className="grid gap-4">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>

                <div>
                  <h3 className="mb-1">{patient.name}</h3>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>ID: {patient.id}</span>
                    <span>Age: {calculateAge(patient.dateOfBirth)}</span>
                    <span>DOB: {patient.dateOfBirth}</span>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600 mt-2">
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <span>{patient.phone}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Mail className="w-3 h-3" />
                      <span>{patient.email}</span>
                    </div>
                  </div>

                  {patient.allergies.length > 0 &&
                    patient.allergies[0] !== "None known" && (
                      <div className="mt-2">
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                          Allergies: {patient.allergies.join(", ")}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                View Full Record
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Patient Details Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="mb-2">Patient Medical Record</h2>
                <p className="text-gray-600">
                  {selectedPatient.name} ({selectedPatient.id})
                </p>
              </div>

              <button
                onClick={() => setSelectedPatient(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Personal Information */}
            <div className="mb-6">
              <h3 className="mb-4">Personal Information</h3>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Full Name
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.name}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Patient ID
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.id}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Date of Birth
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.dateOfBirth} (
                    {calculateAge(selectedPatient.dateOfBirth)} years old)
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Phone
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.phone}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Email
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.email}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Address
                  </p>
                  <p className="text-gray-900">
                    {selectedPatient.address}
                  </p>
                </div>
              </div>
            </div>

            {/* Medical Information */}
            <div className="mb-6">
              <h3 className="mb-4">Medical Information</h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Allergies
                  </p>

                  {selectedPatient.allergies.map((allergy, idx) => (
                    <span
                      key={idx}
                      className={`inline-block px-2 py-1 mr-2 mb-2 rounded text-sm ${
                        allergy === "None known"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {allergy}
                    </span>
                  ))}
                </div>

                <div className="p-4 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Medical Conditions
                  </p>

                  {selectedPatient.conditions.length > 0 ? (
                    selectedPatient.conditions.map((condition, idx) => (
                      <span
                        key={idx}
                        className="inline-block px-2 py-1 mr-2 mb-2 bg-blue-100 text-blue-800 rounded text-sm"
                      >
                        {condition}
                      </span>
                    ))
                  ) : (
                    <span className="inline-block px-2 py-1 mr-2 mb-2 bg-gray-100 text-gray-800 rounded text-sm">
                      None known
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Prescription History */}
            <div className="mb-6">
              <h3 className="mb-4">Prescription</h3>

              <div className="space-y-3">
                {selectedPatient.prescriptionHistory.length > 0 ? (
                  selectedPatient.prescriptionHistory.map((rx) => (
                    <div
                      key={rx.id}
                      className="p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <p className="text-gray-900">{rx.id}</p>

                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                rx.status === "Fulfilled"
                                  ? "bg-green-100 text-green-800"
                                  : rx.status === "In Progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {rx.status}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-3 h-3" />
                            <span>{rx.date}</span>
                            <span>•</span>
                            <span>{rx.doctor}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600 mb-2">
                          Medications:
                        </p>

                        <div className="space-y-1">
                          {rx.medications.map((med, idx) => (
                            <div
                              key={idx}
                              className="flex items-center gap-2 text-sm"
                            >
                              <FileText className="w-3 h-3 text-gray-400" />
                              <span className="text-gray-900">
                                {med}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 border border-gray-200 rounded-lg text-gray-600">
                    No prescription history available.
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
              <button
                onClick={() => setSelectedPatient(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>

              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Mark Prescription as COMPLETED
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Patient Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="mb-4">Add New Patient</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  value={newPatient.dateOfBirth}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      dateOfBirth: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="text"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      phone: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={newPatient.email}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      email: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      address: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter address"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Allergies
                </label>
                <input
                  type="text"
                  value={newPatient.allergies}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      allergies: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Example: Penicillin, Sulfa drugs"
                />
              </div>

              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  Medical Conditions
                </label>
                <input
                  type="text"
                  value={newPatient.conditions}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      conditions: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Example: Hypertension, Diabetes"
                />
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewPatient(emptyPatientForm);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleCreatePatient}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Patient
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}