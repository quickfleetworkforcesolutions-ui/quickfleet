import { Stack, useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Platform,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { postJson } from "@/lib/api";
import * as DocumentPicker from "expo-document-picker";

interface RiderApplicationForm {
  fullName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  drivingLicenseNumber: string;
  licenseExpiryDate: string;
  licenseType: string;
  aadhaarNumber: string;
  panNumber: string;
  vehicleOwnership: string;
  vehicleType: string;
  vehicleRegistrationNumber: string;
  deliveryExperienceMonths: string;
  navigationAppProficiency: string;
  shiftPreference: string;
  hiringType: string;
  expectedSalary: string;
  resumeUrl: string;
}

export default function ApplyRiderScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  
  const [form, setForm] = useState<RiderApplicationForm>({
    fullName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    drivingLicenseNumber: "",
    licenseExpiryDate: "",
    licenseType: "TWO_WHEELER",
    aadhaarNumber: "",
    panNumber: "",
    vehicleOwnership: "OWN",
    vehicleType: "BIKE",
    vehicleRegistrationNumber: "",
    deliveryExperienceMonths: "0",
    navigationAppProficiency: "INTERMEDIATE",
    shiftPreference: "FLEXIBLE",
    hiringType: "PERMANENT",
    expectedSalary: "",
    resumeUrl: "",
  });

  const [resume, setResume] = useState<DocumentPicker.DocumentPickerAsset | null>(null);

  const submitMutation = useMutation({
    mutationFn: async (data: Partial<RiderApplicationForm>) => {
      return postJson("/riders/applications", data);
    },
    onSuccess: () => {
      Alert.alert(
        "Success",
        "Your rider application has been submitted successfully! We will review your application and contact you soon.",
        [{ text: "OK", onPress: () => router.back() }]
      );
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to submit application");
    },
  });

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets?.[0]) {
        setResume(result.assets[0]);
        // In production, upload to cloud storage and get URL
        setForm({ ...form, resumeUrl: result.assets[0].uri });
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document");
    }
  };

  const validateForm = (): boolean => {
    if (!form.fullName || !form.email || !form.phone) {
      Alert.alert("Error", "Please fill in all required personal information");
      return false;
    }

    if (!form.drivingLicenseNumber || !form.licenseExpiryDate) {
      Alert.alert("Error", "Driving license details are required");
      return false;
    }

    if (!form.aadhaarNumber || form.aadhaarNumber.length !== 12) {
      Alert.alert("Error", "Valid 12-digit Aadhaar number is required");
      return false;
    }

    if (!form.panNumber || form.panNumber.length !== 10) {
      Alert.alert("Error", "Valid 10-character PAN number is required");
      return false;
    }

    return true;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const payload = {
      ...form,
      deliveryExperienceMonths: parseInt(form.deliveryExperienceMonths) || 0,
      expectedSalary: form.expectedSalary ? parseInt(form.expectedSalary) : null,
      sourceChannel: "MOBILE_APP",
    };

    submitMutation.mutate(payload);
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: "Apply as Delivery Rider",
          headerTitleStyle: { fontSize: 18 },
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Rider Application Form</Text>
          <Text style={styles.subtitle}>
            Fill in all required details to apply for delivery rider position
          </Text>
        </View>

        {/* Personal Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Full Name *"
            value={form.fullName}
            onChangeText={(text) => setForm({ ...form, fullName: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Email *"
            keyboardType="email-address"
            autoCapitalize="none"
            value={form.email}
            onChangeText={(text) => setForm({ ...form, email: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Phone Number *"
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Date of Birth (YYYY-MM-DD)"
            value={form.dateOfBirth}
            onChangeText={(text) => setForm({ ...form, dateOfBirth: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="Address"
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
          />
          
          <View style={styles.row}>
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="City *"
              value={form.city}
              onChangeText={(text) => setForm({ ...form, city: text })}
            />
            
            <TextInput
              style={[styles.input, styles.halfInput]}
              placeholder="State"
              value={form.state}
              onChangeText={(text) => setForm({ ...form, state: text })}
            />
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Pincode"
            keyboardType="number-pad"
            value={form.pincode}
            onChangeText={(text) => setForm({ ...form, pincode: text })}
          />
        </View>

        {/* Document Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Document Information</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Driving License Number *"
            value={form.drivingLicenseNumber}
            onChangeText={(text) => setForm({ ...form, drivingLicenseNumber: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="License Expiry Date (YYYY-MM-DD) *"
            value={form.licenseExpiryDate}
            onChangeText={(text) => setForm({ ...form, licenseExpiryDate: text })}
          />
          
          <Text style={styles.label}>License Type *</Text>
          <View style={styles.radioGroup}>
            <TouchableOpacity
              style={[styles.radioButton, form.licenseType === "TWO_WHEELER" && styles.radioButtonActive]}
              onPress={() => setForm({ ...form, licenseType: "TWO_WHEELER" })}
            >
              <Text style={form.licenseType === "TWO_WHEELER" ? styles.radioTextActive : styles.radioText}>
                Two Wheeler
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.radioButton, form.licenseType === "FOUR_WHEELER" && styles.radioButtonActive]}
              onPress={() => setForm({ ...form, licenseType: "FOUR_WHEELER" })}
            >
              <Text style={form.licenseType === "FOUR_WHEELER" ? styles.radioTextActive : styles.radioText}>
                Four Wheeler
              </Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Aadhaar Number (12 digits) *"
            keyboardType="number-pad"
            maxLength={12}
            value={form.aadhaarNumber}
            onChangeText={(text) => setForm({ ...form, aadhaarNumber: text })}
          />
          
          <TextInput
            style={styles.input}
            placeholder="PAN Number (10 characters) *"
            autoCapitalize="characters"
            maxLength={10}
            value={form.panNumber}
            onChangeText={(text) => setForm({ ...form, panNumber: text.toUpperCase() })}
          />
        </View>

        {/* Vehicle Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Vehicle Information</Text>
          
          <Text style={styles.label}>Vehicle Ownership *</Text>
          <View style={styles.radioGroup}>
            {["OWN", "RENTAL", "NONE"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, form.vehicleOwnership === option && styles.radioButtonActive]}
                onPress={() => setForm({ ...form, vehicleOwnership: option })}
              >
                <Text style={form.vehicleOwnership === option ? styles.radioTextActive : styles.radioText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          {form.vehicleOwnership !== "NONE" && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Vehicle Registration Number"
                autoCapitalize="characters"
                value={form.vehicleRegistrationNumber}
                onChangeText={(text) => setForm({ ...form, vehicleRegistrationNumber: text.toUpperCase() })}
              />
            </>
          )}
        </View>

        {/* Experience & Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Experience & Skills</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Delivery Experience (in months)"
            keyboardType="number-pad"
            value={form.deliveryExperienceMonths}
            onChangeText={(text) => setForm({ ...form, deliveryExperienceMonths: text })}
          />
          
          <Text style={styles.label}>Navigation App Proficiency</Text>
          <View style={styles.radioGroup}>
            {["BEGINNER", "INTERMEDIATE", "ADVANCED"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, form.navigationAppProficiency === option && styles.radioButtonActive]}
                onPress={() => setForm({ ...form, navigationAppProficiency: option })}
              >
                <Text style={form.navigationAppProficiency === option ? styles.radioTextActive : styles.radioText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Preferences</Text>
          
          <Text style={styles.label}>Shift Preference</Text>
          <View style={styles.radioGroup}>
            {["DAY", "NIGHT", "ROTATIONAL", "FLEXIBLE"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, form.shiftPreference === option && styles.radioButtonActive]}
                onPress={() => setForm({ ...form, shiftPreference: option })}
              >
                <Text style={form.shiftPreference === option ? styles.radioTextActive : styles.radioText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <Text style={styles.label}>Hiring Type *</Text>
          <View style={styles.radioGroup}>
            {["PERMANENT", "CONTRACT", "TEMPORARY"].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.radioButton, form.hiringType === option && styles.radioButtonActive]}
                onPress={() => setForm({ ...form, hiringType: option })}
              >
                <Text style={form.hiringType === option ? styles.radioTextActive : styles.radioText}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TextInput
            style={styles.input}
            placeholder="Expected Monthly Salary (₹)"
            keyboardType="number-pad"
            value={form.expectedSalary}
            onChangeText={(text) => setForm({ ...form, expectedSalary: text })}
          />
        </View>

        {/* Resume Upload */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resume (Optional)</Text>
          
          <TouchableOpacity style={styles.uploadButton} onPress={pickDocument}>
            <Text style={styles.uploadButtonText}>
              {resume ? `📄 ${resume.name}` : "📎 Upload Resume (PDF/DOC)"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitMutation.isPending && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitMutation.isPending}
        >
          <Text style={styles.submitButtonText}>
            {submitMutation.isPending ? "Submitting..." : "Submit Application"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            * Required fields. Your information will be kept confidential and used only for recruitment purposes.
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInput: {
    width: "48%",
  },
  radioGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
  },
  radioButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: "#fff",
  },
  radioButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  radioText: {
    fontSize: 13,
    color: "#666",
  },
  radioTextActive: {
    fontSize: 13,
    color: "#fff",
    fontWeight: "500",
  },
  uploadButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 16,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderStyle: "dashed",
  },
  uploadButtonText: {
    fontSize: 15,
    color: "#007AFF",
  },
  submitButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  footer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#fff3cd",
    borderRadius: 8,
  },
  footerText: {
    fontSize: 12,
    color: "#856404",
    lineHeight: 18,
  },
});
