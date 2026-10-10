import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { KeyboardAwareScrollViewCompat } from "@/components/KeyboardAwareScrollViewCompat";
import { useColors } from "@/hooks/useColors";
import { Language, useStore } from "@/store/useStore";

const REGISTRATION_STORAGE_KEY = "bhoomi.farmer-registration";

const LANGUAGES: { code: Language; label: string }[] = [
  { code: "mr", label: "मराठी" },
  { code: "hi", label: "हिंदी" },
  { code: "en", label: "English" },
];

const COPY: Record<
  Language,
  {
    welcome: string;
    title: string;
    subtitle: string;
    language: string;
    farmerName: string;
    farmerNamePlaceholder: string;
    mobile: string;
    village: string;
    villagePlaceholder: string;
    farmName: string;
    farmNamePlaceholder: string;
    continue: string;
    otpNote: string;
    existingAccount: string;
    login: string;
    validation: string;
    saveError: string;
  }
> = {
  mr: {
    welcome: "नवीन शेतकरी · Welcome",
    title: "Bhoomi मध्ये नोंदणी",
    subtitle: "तुमच्या शेतासाठी स्मार्ट सिंचन सुरू करा",
    language: "भाषा निवडा",
    farmerName: "शेतकऱ्याचे नाव",
    farmerNamePlaceholder: "उदा. रमेश शिंदे",
    mobile: "मोबाइल नंबर",
    village: "गाव / ठिकाण",
    villagePlaceholder: "उदा. वडाळे, पुणे",
    farmName: "शेताचे नाव",
    farmNamePlaceholder: "उदा. शिंदे फार्म",
    continue: "पुढे जा · OTP पडताळणी",
    otpNote: "मोबाइल नंबरवर OTP पाठवून नोंदणी पूर्ण करा",
    existingAccount: "आधीच खाते आहे?",
    login: "लॉगिन करा",
    validation: "नाव, 10 अंकी मोबाइल नंबर, गाव आणि शेताचे नाव भरा.",
    saveError: "माहिती जतन झाली नाही. पुन्हा प्रयत्न करा.",
  },
  hi: {
    welcome: "नए किसान · Welcome",
    title: "Bhoomi पर पंजीकरण",
    subtitle: "अपने खेत के लिए स्मार्ट सिंचाई शुरू करें",
    language: "भाषा चुनें",
    farmerName: "किसान का नाम",
    farmerNamePlaceholder: "उदा. रमेश शिंदे",
    mobile: "मोबाइल नंबर",
    village: "गाँव / स्थान",
    villagePlaceholder: "उदा. वडाले, पुणे",
    farmName: "खेत का नाम",
    farmNamePlaceholder: "उदा. शिंदे फार्म",
    continue: "आगे बढ़ें · OTP से पुष्टि",
    otpNote: "मोबाइल OTP से पंजीकरण पूरा करें",
    existingAccount: "पहले से खाता है?",
    login: "लॉगिन करें",
    validation: "नाम, 10 अंकों का मोबाइल नंबर, गाँव और खेत का नाम भरें।",
    saveError: "जानकारी सेव नहीं हुई। फिर से कोशिश करें।",
  },
  en: {
    welcome: "New farmer · Welcome",
    title: "Create your Bhoomi account",
    subtitle: "Add your details to get started",
    language: "Choose language",
    farmerName: "Farmer name",
    farmerNamePlaceholder: "e.g. Ramesh Shinde",
    mobile: "Mobile number",
    village: "Village / Location",
    villagePlaceholder: "e.g. Vadale, Pune",
    farmName: "Farm name",
    farmNamePlaceholder: "e.g. Shinde Farm",
    continue: "Continue · Verify phone",
    otpNote: "We’ll send an OTP to verify your mobile number",
    existingAccount: "Already have an account?",
    login: "Log in",
    validation: "Enter your name, 10-digit mobile number, village and farm name.",
    saveError: "Your details could not be saved. Please try again.",
  },
};

export default function RegisterScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { language, setLanguage } = useStore();
  const copy = COPY[language];
  const [farmerName, setFarmerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [village, setVillage] = useState("");
  const [farmName, setFarmName] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const topPadding = Platform.OS === "web" ? 20 : insets.top + 20;

  const continueToLogin = async () => {
    const normalizedMobile = mobile.replace(/\D/g, "").slice(-10);
    if (
      !farmerName.trim() ||
      normalizedMobile.length !== 10 ||
      !village.trim() ||
      !farmName.trim()
    ) {
      setError(copy.validation);
      return;
    }

    setError("");
    setSaving(true);
    try {
      await AsyncStorage.setItem(
        REGISTRATION_STORAGE_KEY,
        JSON.stringify({
          farmerName: farmerName.trim(),
          mobile: normalizedMobile,
          village: village.trim(),
          farmName: farmName.trim(),
          language,
        }),
      );
      router.replace({
        pathname: "/login",
        params: { phone: normalizedMobile },
      });
    } catch {
      setError(copy.saveError);
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.page}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <KeyboardAwareScrollViewCompat
        style={styles.page}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View
          style={[
            styles.header,
            { backgroundColor: colors.primary, paddingTop: topPadding },
          ]}
        >
          <View style={styles.brandRow}>
            <View style={styles.brandMark}>
              <Feather name="feather" size={22} color="#fff" />
            </View>
            <Text style={styles.brandName}>BHOOMI</Text>
          </View>
          <Text style={styles.headerWelcome}>{copy.welcome}</Text>
          <Text style={styles.headerTitle}>{copy.title}</Text>
          <Text style={styles.headerSubtitle}>{copy.subtitle}</Text>
        </View>

        <View style={styles.formBody}>
          <View style={[styles.languageCard, { borderColor: colors.border }]}>
            <Text style={[styles.fieldLabel, { color: colors.mutedForeground }]}>
              {copy.language}
            </Text>
            <View style={styles.languageRow}>
              {LANGUAGES.map((item) => {
                const selected = language === item.code;
                return (
                  <TouchableOpacity
                    key={item.code}
                    style={[
                      styles.languageButton,
                      {
                        backgroundColor: selected ? colors.primary : "#fff",
                        borderColor: selected ? colors.primary : colors.border,
                      },
                    ]}
                    onPress={() => setLanguage(item.code)}
                    activeOpacity={0.75}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                  >
                    <Text
                      style={[
                        styles.languageButtonText,
                        { color: selected ? "#fff" : colors.foreground },
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              {copy.farmerName}
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderColor: colors.border, backgroundColor: "#fafbf9" },
              ]}
            >
              <Feather name="user" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                value={farmerName}
                onChangeText={setFarmerName}
                placeholder={copy.farmerNamePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              {copy.mobile}
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderColor: colors.border, backgroundColor: "#fafbf9" },
              ]}
            >
              <Text style={[styles.countryCode, { color: colors.foreground }]}>
                +91
              </Text>
              <View
                style={[
                  styles.inputDivider,
                  { backgroundColor: colors.border },
                ]}
              />
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                value={mobile}
                onChangeText={(value) =>
                  setMobile(value.replace(/\D/g, "").slice(0, 10))
                }
                placeholder="98765 43210"
                placeholderTextColor={colors.mutedForeground}
                keyboardType="phone-pad"
                maxLength={10}
                autoComplete="tel-national"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              {copy.village}
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderColor: colors.border, backgroundColor: "#fafbf9" },
              ]}
            >
              <Feather name="map-pin" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                value={village}
                onChangeText={setVillage}
                placeholder={copy.villagePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                returnKeyType="next"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={[styles.fieldLabel, { color: colors.foreground }]}>
              {copy.farmName}
            </Text>
            <View
              style={[
                styles.inputRow,
                { borderColor: colors.border, backgroundColor: "#fafbf9" },
              ]}
            >
              <Feather name="home" size={17} color={colors.mutedForeground} />
              <TextInput
                style={[styles.textInput, { color: colors.foreground }]}
                value={farmName}
                onChangeText={setFarmName}
                placeholder={copy.farmNamePlaceholder}
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="words"
                returnKeyType="done"
                onSubmitEditing={continueToLogin}
              />
            </View>
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={styles.errorText}>
              {error}
            </Text>
          ) : null}

          <TouchableOpacity
            style={[
              styles.continueButton,
              { backgroundColor: saving ? colors.mediumGreen : colors.primary },
            ]}
            onPress={continueToLogin}
            activeOpacity={0.85}
            disabled={saving}
            accessibilityRole="button"
          >
            <Text style={styles.continueButtonText}>{copy.continue}</Text>
            <Feather name="arrow-right" size={19} color="#fff" />
          </TouchableOpacity>

          <Text style={[styles.otpNote, { color: colors.mutedForeground }]}>
            {copy.otpNote}
          </Text>

          <View style={[styles.loginRow, { borderTopColor: colors.border }]}>
            <Text style={[styles.loginPrompt, { color: colors.mutedForeground }]}>
              {copy.existingAccount}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => router.replace("/login")}
              activeOpacity={0.75}
              accessibilityRole="button"
            >
              <Text style={[styles.loginLink, { color: colors.primary }]}>
                {copy.login}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollViewCompat>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 22,
    gap: 4,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  brandMark: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.16)",
  },
  brandName: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "900",
    letterSpacing: 2.4,
  },
  headerWelcome: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 12,
    fontWeight: "600",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 2,
  },
  headerSubtitle: {
    color: "rgba(255,255,255,0.78)",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
  },
  formBody: {
    padding: 18,
    gap: 14,
  },
  languageCard: {
    borderWidth: 1.5,
    borderRadius: 13,
    padding: 13,
    gap: 10,
  },
  field: {
    gap: 7,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.15,
  },
  languageRow: {
    flexDirection: "row",
    gap: 8,
  },
  languageButton: {
    flex: 1,
    minHeight: 40,
    borderRadius: 22,
    borderWidth: 1.3,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  languageButtonText: {
    fontSize: 13,
    fontWeight: "700",
  },
  inputRow: {
    minHeight: 50,
    borderWidth: 1.3,
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 10,
  },
  countryCode: {
    fontSize: 15,
    fontWeight: "700",
  },
  inputDivider: {
    width: 1,
    height: 25,
  },
  textInput: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 11,
    fontSize: 15,
    fontWeight: "500",
  },
  errorText: {
    color: "#B42318",
    fontSize: 12,
    fontWeight: "600",
    lineHeight: 18,
  },
  continueButton: {
    minHeight: 52,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  continueButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "800",
  },
  otpNote: {
    textAlign: "center",
    fontSize: 11,
    lineHeight: 16,
    marginTop: -5,
  },
  loginRow: {
    borderTopWidth: 1,
    paddingTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  loginPrompt: {
    fontSize: 13,
  },
  loginLink: {
    fontSize: 13,
    fontWeight: "800",
  },
});
