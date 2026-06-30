import { Stack, router } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useMutation } from "@tanstack/react-query";
import { postJson } from "@/lib/api";

interface EligibilityForm {
  age: number | null;
  hasValidDL: boolean | null;
  dlAgeInYears: number | null;
  hasAadhaar: boolean | null;
  hasPAN: boolean | null;
  hasBankAccount: boolean | null;
  hasSmartphone: boolean | null;
  hasVehicle: boolean | null;
}

export default function RiderEligibilityCheckScreen() {
  const [form, setForm] = useState<EligibilityForm>({
    age: null,
    hasValidDL: null,
    dlAgeInYears: null,
    hasAadhaar: null,
    hasPAN: null,
    hasBankAccount: null,
    hasSmartphone: null,
    hasVehicle: null,
  });

  const [result, setResult] = useState<any>(null);

  const checkMutation = useMutation({
    mutationFn: async (data: any) => {
      return postJson("/riders/eligibility-check", data);
    },
    onSuccess: (response: any) => {
      setResult(response);
    },
    onError: (error: Error) => {
      Alert.alert("Error", error.message || "Failed to check eligibility");
    },
  });

  const handleCheck = () => {
    if (form.age === null) {
      Alert.alert("Error", "Please enter your age");
      return;
    }

    if (form.hasValidDL === null || form.hasAadhaar === null || form.hasPAN === null) {
      Alert.alert("Error", "Please answer all required questions");
      return;
    }

    checkMutation.mutate(form);
  };

  const handleApply = () => {
    router.push("/apply-rider/delivery-rider");
  };

  const renderBooleanQuestion = (
    label: string,
    field: keyof EligibilityForm,
    required: boolean = true
  ) => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>
        {label} {required && <Text style={styles.required}>*</Text>}
      </Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            form[field] === true && styles.optionButtonActive,
          ]}
          onPress={() => setForm({ ...form, [field]: true })}
        >
          <Text
            style={form[field] === true ? styles.optionTextActive : styles.optionText}
          >
            ✓ Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            form[field] === false && styles.optionButtonActive,
          ]}
          onPress={() => setForm({ ...form, [field]: false })}
        >
          <Text
            style={form[field] === false ? styles.optionTextActive : styles.optionText}
          >
            ✗ No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderAgeSelector = () => (
    <View style={styles.questionContainer}>
      <Text style={styles.questionLabel}>
        Your Age <Text style={styles.required}>*</Text>
      </Text>
      <View style={styles.ageGrid}>
        {[18, 22, 26, 30, 34, 38, 42, 45].map((age) => (
          <TouchableOpacity
            key={age}
            style={[
              styles.ageButton,
              form.age === age && styles.ageButtonActive,
            ]}
            onPress={() => setForm({ ...form, age })}
          >
            <Text
              style={form.age === age ? styles.ageTextActive : styles.ageText}
            >
              {age}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: "Rider Eligibility Check",
          headerTitleStyle: { fontSize: 18 },
        }}
      />

      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {!result ? (
          <>
            <View style={styles.header}>
              <Text style={styles.title}>Check Your Eligibility</Text>
              <Text style={styles.subtitle}>
                Answer a few quick questions to check if you meet the requirements for
                becoming a delivery rider
              </Text>
            </View>

            <View style={styles.form}>
              {renderAgeSelector()}
              {renderBooleanQuestion("Do you have a valid driving license?", "hasValidDL")}
              
              {form.hasValidDL === true && (
                <View style={styles.questionContainer}>
                  <Text style={styles.questionLabel}>License age (years)</Text>
                  <View style={styles.buttonGroup}>
                    {[0, 1, 2, 3, 5].map((years) => (
                      <TouchableOpacity
                        key={years}
                        style={[
                          styles.smallButton,
                          form.dlAgeInYears === years && styles.optionButtonActive,
                        ]}
                        onPress={() => setForm({ ...form, dlAgeInYears: years })}
                      >
                        <Text
                          style={
                            form.dlAgeInYears === years
                              ? styles.optionTextActive
                              : styles.optionText
                          }
                        >
                          {years === 0 ? "< 1" : years}y
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}

              {renderBooleanQuestion("Do you have an Aadhaar card?", "hasAadhaar")}
              {renderBooleanQuestion("Do you have a PAN card?", "hasPAN")}
              {renderBooleanQuestion("Do you have a bank account?", "hasBankAccount")}
              {renderBooleanQuestion("Do you have a smartphone?", "hasSmartphone")}
              {renderBooleanQuestion("Do you own a two-wheeler?", "hasVehicle", false)}
            </View>

            <TouchableOpacity
              style={[
                styles.checkButton,
                checkMutation.isPending && styles.checkButtonDisabled,
              ]}
              onPress={handleCheck}
              disabled={checkMutation.isPending}
            >
              <Text style={styles.checkButtonText}>
                {checkMutation.isPending ? "Checking..." : "Check Eligibility"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.resultContainer}>
            <View
              style={[
                styles.resultHeader,
                result.eligible ? styles.resultHeaderSuccess : styles.resultHeaderError,
              ]}
            >
              <Text style={styles.resultIcon}>
                {result.eligible ? "✓" : "✗"}
              </Text>
              <Text style={styles.resultTitle}>
                {result.eligible ? "You're Eligible!" : "Not Eligible Yet"}
              </Text>
              <Text style={styles.resultMessage}>{result.message}</Text>
            </View>

            <View style={styles.criteriaList}>
              <Text style={styles.criteriaTitle}>Eligibility Criteria:</Text>
              {result.criteria.map((criterion: any, index: number) => (
                <View key={index} style={styles.criteriaItem}>
                  <Text
                    style={[
                      styles.criteriaIcon,
                      criterion.met ? styles.criteriaIconMet : styles.criteriaIconNotMet,
                    ]}
                  >
                    {criterion.met ? "✓" : "✗"}
                  </Text>
                  <View style={styles.criteriaContent}>
                    <Text style={styles.criteriaName}>{criterion.name}</Text>
                    <Text style={styles.criteriaMessage}>{criterion.message}</Text>
                  </View>
                </View>
              ))}
            </View>

            {result.eligible && (
              <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                <Text style={styles.applyButtonText}>Apply Now →</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setResult(null);
                setForm({
                  age: null,
                  hasValidDL: null,
                  dlAgeInYears: null,
                  hasAadhaar: null,
                  hasPAN: null,
                  hasBankAccount: null,
                  hasSmartphone: null,
                  hasVehicle: null,
                });
              }}
            >
              <Text style={styles.resetButtonText}>Check Again</Text>
            </TouchableOpacity>
          </View>
        )}
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
  },
  form: {
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
  questionContainer: {
    marginBottom: 24,
  },
  questionLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 12,
  },
  required: {
    color: "#ff3b30",
  },
  buttonGroup: {
    flexDirection: "row",
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  optionButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#666",
  },
  optionTextActive: {
    fontSize: 15,
    fontWeight: "600",
    color: "#fff",
  },
  ageGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  ageButton: {
    width: 70,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  ageButtonActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  ageText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  ageTextActive: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  smallButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  checkButton: {
    backgroundColor: "#007AFF",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  checkButtonDisabled: {
    backgroundColor: "#ccc",
  },
  checkButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  resultContainer: {
    paddingTop: 20,
  },
  resultHeader: {
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  resultHeaderSuccess: {
    backgroundColor: "#d4edda",
  },
  resultHeaderError: {
    backgroundColor: "#f8d7da",
  },
  resultIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  resultMessage: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
  },
  criteriaList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  criteriaTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  criteriaItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  criteriaIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  criteriaIconMet: {
    color: "#28a745",
  },
  criteriaIconNotMet: {
    color: "#dc3545",
  },
  criteriaContent: {
    flex: 1,
  },
  criteriaName: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  criteriaMessage: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  applyButton: {
    backgroundColor: "#28a745",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  resetButton: {
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});
