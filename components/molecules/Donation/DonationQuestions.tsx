import React from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { DonationFormData } from "../../../app/services/donationService";
import { useLanguage } from "../../../app/context/LanguageContext";

interface DonationQuestionsProps {
  formData: DonationFormData;
  onUpdateField: (field: keyof DonationFormData, value: any) => void;
}

const DonationQuestions: React.FC<DonationQuestionsProps> = ({
  formData,
  onUpdateField,
}) => {
  const { t } = useLanguage();

  const questions: {
    key: keyof DonationFormData;
    question: string;
    description?: string;
  }[] = [
    {
      key: "anyDifficulty",
      question: t("donation.questions.anyDifficulty"),
      description: t("donation.descriptions.anyDifficulty"),
    },
    {
      key: "medicalAdvice",
      question: t("donation.questions.medicalAdvice"),
      description: t("donation.descriptions.medicalAdvice"),
    },
    {
      key: "feelingWell",
      question: t("donation.questions.feelingWell"),
      description: t("donation.descriptions.feelingWell"),
    },
    {
      key: "takingMedicines",
      question: t("donation.questions.takingMedicines"),
      description: t("donation.descriptions.takingMedicines"),
    },
    {
      key: "anySurgery",
      question: t("donation.questions.anySurgery"),
      description: t("donation.descriptions.anySurgery"),
    },
    {
      key: "pregnant",
      question: t("donation.questions.pregnant"),
      description: t("donation.descriptions.pregnant"),
    },
    {
      key: "haveHepatitis",
      question: t("donation.questions.haveHepatitis"),
      description: t("donation.descriptions.haveHepatitis"),
    },
    {
      key: "tattoos",
      question: t("donation.questions.tattoos"),
      description: t("donation.descriptions.tattoos"),
    },
    {
      key: "travelledAbroad",
      question: t("donation.questions.travelledAbroad"),
      description: t("donation.descriptions.travelledAbroad"),
    },
    {
      key: "receivedBlood",
      question: t("donation.questions.receivedBlood"),
      description: t("donation.descriptions.receivedBlood"),
    },
    {
      key: "bookAspirin",
      question: t("donation.questions.bookAspirin"),
      description: t("donation.descriptions.bookAspirin"),
    },
    {
      key: "knowledgeAgent",
      question: t("donation.questions.knowledgeAgent"),
      description: t("donation.descriptions.knowledgeAgent"),
    },
    {
      key: "feverLymphNode",
      question: t("donation.questions.feverLymphNode"),
      description: t("donation.descriptions.feverLymphNode"),
    },
    // Additional schema flags
    {
      key: "hasDonatedBefore",
      question: t("donation.questions.hasDonatedBefore"),
      description: t("donation.descriptions.hasDonatedBefore"),
    },
    {
      key: "workingLater",
      question: t("donation.questions.workingLater"),
      description: t("donation.descriptions.workingLater"),
    },
    {
      key: "haveTB",
      question: t("donation.questions.haveTB"),
      description: t("donation.descriptions.haveTB"),
    },
    {
      key: "hadVaccination",
      question: t("donation.questions.hadVaccination"),
      description: t("donation.descriptions.hadVaccination"),
    },
    {
      key: "haveImprisonment",
      question: t("donation.questions.haveImprisonment"),
      description: t("donation.descriptions.haveImprisonment"),
    },
    {
      key: "hadMalaria",
      question: t("donation.questions.hadMalaria"),
      description: t("donation.descriptions.hadMalaria"),
    },
    {
      key: "hasDengue",
      question: t("donation.questions.hasDengue"),
      description: t("donation.descriptions.hasDengue"),
    },
    {
      key: "hadLongFever",
      question: t("donation.questions.hadLongFever"),
      description: t("donation.descriptions.hadLongFever"),
    },
    {
      key: "hadtoothExtraction",
      question: t("donation.questions.hadtoothExtraction"),
      description: t("donation.descriptions.hadtoothExtraction"),
    },
    {
      key: "Acknowledgement",
      question: t("donation.questions.Acknowledgement"),
      description: t("donation.descriptions.Acknowledgement"),
    },
    {
      key: "highRisk",
      question: t("donation.questions.highRisk"),
      description: t("donation.descriptions.highRisk"),
    },
    {
      key: "hadWeightLoss",
      question: t("donation.questions.hadWeightLoss"),
      description: t("donation.descriptions.hadWeightLoss"),
    },
  ];

  const diseaseOptions = [
    { key: "hepatitis", label: "Hepatitis" },
    { key: "tb", label: "Tuberculosis" },
    { key: "malaria", label: "Malaria" },
    { key: "dengue", label: "Dengue" },
    { key: "longFever", label: "Long standing fever" },
    { key: "toothExtraction", label: "Tooth extraction" },
    { key: "other", label: "Other conditions" },
  ];

  const toggleDisease = (dKey: string) => {
    const prev =
      formData.anyDiseases && typeof formData.anyDiseases === "object"
        ? (formData.anyDiseases as Record<string, any>)
        : {};
    const updated = { ...prev, [dKey]: !prev[dKey] };
    onUpdateField("anyDiseases", updated as any);
  };

  return (
    <View style={{ backgroundColor: "#F9FAFB", padding: 16 }}>
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: "#1F2937",
          marginBottom: 16,
        }}
      >
        Health Questions
      </Text>
      <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 24 }}>
        Please answer YES or NO to each question:
      </Text>

      {questions.map((q) => (
        <View
          key={String(q.key)}
          style={{
            backgroundColor: "white",
            padding: 16,
            marginBottom: 12,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#E5E7EB",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "500",
                  color: "#1F2937",
                  marginBottom: 4,
                }}
              >
                {q.question}
              </Text>
              {q.description && (
                <Text style={{ fontSize: 14, color: "#6B7280" }}>
                  {q.description}
                </Text>
              )}
            </View>

            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: Boolean((formData as any)[q.key])
                    ? "#DC2626"
                    : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: Boolean((formData as any)[q.key])
                    ? "#DC2626"
                    : "#D1D5DB",
                }}
                onPress={() => onUpdateField(q.key, true)}
              >
                <Text
                  style={{
                    color: Boolean((formData as any)[q.key])
                      ? "white"
                      : "#6B7280",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  YES
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={{
                  paddingVertical: 8,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: !Boolean((formData as any)[q.key])
                    ? "#DC2626"
                    : "#F3F4F6",
                  borderWidth: 1,
                  borderColor: !Boolean((formData as any)[q.key])
                    ? "#DC2626"
                    : "#D1D5DB",
                }}
                onPress={() => {
                  onUpdateField(q.key, false);
                  // Clear anyDifficulty details when set to NO
                  if (q.key === "anyDifficulty") {
                    onUpdateField("anyDifficulty", "");
                  }
                }}
              >
                <Text
                  style={{
                    color: !Boolean((formData as any)[q.key])
                      ? "white"
                      : "#6B7280",
                    fontWeight: "600",
                    fontSize: 14,
                  }}
                >
                  NO
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Show details input below when anyDifficulty is truthy */}
          {q.key === "anyDifficulty" &&
            (formData.anyDifficulty === true ||
              (typeof formData.anyDifficulty === "string" &&
                (formData.anyDifficulty as string).length > 0)) && (
              <View style={{ marginTop: 12 }}>
                <TextInput
                  value={
                    typeof formData.anyDifficulty === "string"
                      ? (formData.anyDifficulty as string)
                      : ""
                  }
                  onChangeText={(text) => onUpdateField("anyDifficulty", text)}
                  placeholder={t("donation.placeholders.anyDifficulty")}
                  multiline={true}
                  style={{
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                    borderRadius: 8,
                    padding: 8,
                    height: 80,
                    textAlignVertical: "top",
                    backgroundColor: "#fff",
                  }}
                />
              </View>
            )}
        </View>
      ))}

      {/* Diseases checklist that maps into anyDiseases JSON */}
      <View
        style={{
          backgroundColor: "white",
          padding: 16,
          marginTop: 8,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#E5E7EB",
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 8 }}>
          Medical Conditions
        </Text>
        <Text style={{ fontSize: 14, color: "#6B7280", marginBottom: 12 }}>
          Select any conditions you have experienced:
        </Text>
        {diseaseOptions.map((d) => {
          const checked = !!(
            formData.anyDiseases &&
            typeof formData.anyDiseases === "object" &&
            (formData.anyDiseases as Record<string, any>)[d.key]
          );
          return (
            <TouchableOpacity
              key={d.key}
              onPress={() => toggleDisease(d.key)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderBottomColor: "#F3F4F6",
              }}
            >
              <Text style={{ fontSize: 15, color: "#111827" }}>{d.label}</Text>
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 4,
                  borderWidth: 1,
                  borderColor: checked ? "#DC2626" : "#D1D5DB",
                  backgroundColor: checked ? "#DC2626" : "#FFF",
                }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default DonationQuestions;
