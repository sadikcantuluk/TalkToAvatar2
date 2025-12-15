import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Dimensions,
    TextInput,
    ActivityIndicator,
    Platform,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth, useToast } from '../context';
import { useCreateCourse } from '../hooks/useCourseQueries';

const { width } = Dimensions.get('window');

const SUPPORTED_LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇺🇸', nativeName: 'English' },
    { code: 'tr', name: 'Turkish', flag: '🇹🇷', nativeName: 'Türkçe' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
    { code: 'fr', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
    { code: 'de', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', flag: '🇮🇹', nativeName: 'Italiano' },
];

const LEVELS = [
    { id: 'A1', label: 'A1 - Beginner', desc: 'Can understand basic phrases' },
    { id: 'A2', label: 'A2 - Elementary', desc: 'Can communicate in simple tasks' },
    { id: 'B1', label: 'B1 - Intermediate', desc: 'Can deal with travel situations' },
    { id: 'B2', label: 'B2 - Upper Intermediate', desc: 'Can interact with fluency' },
    { id: 'C1', label: 'C1 - Advanced', desc: 'Can express ideas fluently' },
    { id: 'C2', label: 'C2 - Mastery', desc: 'Can understand almost everything' },
];

const CourseSetupScreen = ({ navigation }) => {
    const { token, user } = useAuth();
    const { success, error: showError } = useToast();
    const createCourseMutation = useCreateCourse();

    const scrollViewRef = useRef(null);
    const [currentStep, setCurrentStep] = useState(0);

    // Form State
    const [nativeLanguage, setNativeLanguage] = useState('tr'); // Default to Turkish based on user profile
    const [targetLanguage, setTargetLanguage] = useState(null);
    const [courseName, setCourseName] = useState('');
    const [description, setDescription] = useState('');
    const [level, setLevel] = useState(null);

    const totalSteps = 4;

    const scrollToStep = (stepIndex) => {
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: stepIndex * width, animated: true });
            setCurrentStep(stepIndex);
        }
    };

    const handleNext = () => {
        if (currentStep < totalSteps - 1) {
            // Validation Logic
            if (currentStep === 0 && !nativeLanguage) return;
            if (currentStep === 1 && !targetLanguage) return;
            if (currentStep === 2 && (!courseName.trim() || !level)) return;

            scrollToStep(currentStep + 1);
        } else {
            handleCreateCourse();
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            scrollToStep(currentStep - 1);
        } else {
            navigation.goBack();
        }
    };

    const handleCreateCourse = async () => {
        if (!token) {
            Alert.alert('Error', 'Please login to create a course');
            return;
        }

        try {
            const courseData = {
                title: courseName.trim(),
                description: description.trim(),
                language_code: targetLanguage,
                level: level,
                status: 'active',
            };

            console.log('Creating course with data:', courseData);

            const newCourse = await createCourseMutation.mutateAsync(courseData);

            console.log('Course created:', newCourse);

            // Navigate to detail
            // Note: use replace so user can't go back to setup
            navigation.replace('CourseDetail', {
                courseId: newCourse.id,
                course: newCourse
            });

        } catch (err) {
            console.error('Failed to create course:', err);
            showError(err.message || 'Failed to create course');
        }
    };

    const isNextDisabled = () => {
        if (currentStep === 0) return !nativeLanguage;
        if (currentStep === 1) return !targetLanguage;
        if (currentStep === 2) return !courseName.trim() || !level;
        return false;
    };

    const renderStepIndicator = () => (
        <View style={styles.stepIndicatorContainer}>
            {[...Array(totalSteps)].map((_, i) => (
                <View
                    key={i}
                    style={[
                        styles.stepDot,
                        i === currentStep && styles.stepDotActive,
                        i < currentStep && styles.stepDotCompleted
                    ]}
                />
            ))}
        </View>
    );

    const renderLanguageCard = (lang, selected, onSelect) => (
        <TouchableOpacity
            key={lang.code}
            style={[
                styles.optionCard,
                selected === lang.code && styles.optionCardSelected
            ]}
            onPress={() => onSelect(lang.code)}
            activeOpacity={0.7}
        >
            <Text style={styles.flagText}>{lang.flag}</Text>
            <Text style={[
                styles.optionTitle,
                selected === lang.code && styles.optionTitleSelected
            ]}>{lang.nativeName}</Text>
            <Text style={[
                styles.optionSubtitle,
                selected === lang.code && styles.optionSubtitleSelected
            ]}>{lang.name}</Text>

            {selected === lang.code && (
                <View style={styles.checkIcon}>
                    <Ionicons name="checkmark-circle" size={24} color="#2D7F83" />
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#1F2937" />
                </TouchableOpacity>
                {renderStepIndicator()}
                <View style={{ width: 40 }} />
            </View>

            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                scrollEnabled={false} // Disable manual swipe to enforce validation
                showsHorizontalScrollIndicator={false}
                style={styles.contentScroll}
            >
                {/* Step 1: Native Language */}
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>What is your native language?</Text>
                    <Text style={styles.stepSubtitle}>We'll use this for translations and explanations.</Text>

                    <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                        <View style={styles.gridContainer}>
                            {SUPPORTED_LANGUAGES.map(lang =>
                                renderLanguageCard(lang, nativeLanguage, setNativeLanguage)
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* Step 2: Target Language */}
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>What do you want to learn?</Text>
                    <Text style={styles.stepSubtitle}>Choose the language you want to practice.</Text>

                    <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                        <View style={styles.gridContainer}>
                            {SUPPORTED_LANGUAGES.filter(l => l.code !== nativeLanguage).map(lang =>
                                renderLanguageCard(lang, targetLanguage, setTargetLanguage)
                            )}
                        </View>
                    </ScrollView>
                </View>

                {/* Step 3: Course Details */}
                <View style={styles.stepContainer}>
                    <Text style={styles.stepTitle}>Let's name your course</Text>
                    <Text style={styles.stepSubtitle}>And choose your current proficiency level.</Text>

                    <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Course Name</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="e.g., Summer Trip Prep"
                                value={courseName}
                                onChangeText={setCourseName}
                                placeholderTextColor="#9CA3AF"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Description (Optional)</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="What are your goals?"
                                value={description}
                                onChangeText={setDescription}
                                placeholderTextColor="#9CA3AF"
                                multiline
                                numberOfLines={3}
                            />
                        </View>

                        <Text style={[styles.label, { marginTop: 16, marginBottom: 8 }]}>Select Level</Text>
                        {LEVELS.map(lvl => (
                            <TouchableOpacity
                                key={lvl.id}
                                style={[
                                    styles.levelCard,
                                    level === lvl.id && styles.levelCardSelected
                                ]}
                                onPress={() => setLevel(lvl.id)}
                            >
                                <View style={[
                                    styles.levelBadge,
                                    level === lvl.id && styles.levelBadgeSelected
                                ]}>
                                    <Text style={[
                                        styles.levelBadgeText,
                                        level === lvl.id && styles.levelBadgeTextSelected
                                    ]}>{lvl.id}</Text>
                                </View>
                                <View style={styles.levelInfo}>
                                    <Text style={styles.levelLabel}>{lvl.label}</Text>
                                    <Text style={styles.levelDesc}>{lvl.desc}</Text>
                                </View>

                                {level === lvl.id && (
                                    <Ionicons name="checkmark-circle" size={24} color="#2D7F83" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Step 4: Confirmation (or Loading) - Not really needed if we just submit, 
            but good for UX to have a summary or "Ready?" screen */}
                <View style={styles.stepContainer}>
                    <View style={styles.summaryContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="rocket" size={48} color="#2D7F83" />
                        </View>
                        <Text style={styles.stepTitle}>You're all set!</Text>
                        <Text style={[styles.stepSubtitle, { textAlign: 'center' }]}>
                            Ready to start your journey? Using AI to create personalized practice content for you.
                        </Text>

                        <View style={styles.summaryCard}>
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Course</Text>
                                <Text style={styles.summaryValue}>{courseName}</Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Language</Text>
                                <Text style={styles.summaryValue}>
                                    {SUPPORTED_LANGUAGES.find(l => l.code === targetLanguage)?.name}
                                </Text>
                            </View>
                            <View style={styles.divider} />
                            <View style={styles.summaryRow}>
                                <Text style={styles.summaryLabel}>Level</Text>
                                <Text style={styles.summaryValue}>{level}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* Footer Actions */}
            <View style={styles.footer}>
                <TouchableOpacity
                    style={[
                        styles.nextButton,
                        isNextDisabled() && styles.nextButtonDisabled
                    ]}
                    onPress={handleNext}
                    disabled={isNextDisabled() || createCourseMutation.isLoading}
                >
                    {createCourseMutation.isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.nextButtonText}>
                            {currentStep === totalSteps - 1 ? 'Start Learning' : 'Continue'}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        marginTop: Platform.OS === 'android' ? 30 : 0,
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    stepIndicatorContainer: {
        flexDirection: 'row',
        gap: 8,
    },
    stepDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#E5E7EB',
    },
    stepDotActive: {
        backgroundColor: '#2D7F83',
        width: 24, // Elongated dot for active step
    },
    stepDotCompleted: {
        backgroundColor: '#10B981',
    },
    contentScroll: {
        flex: 1,
    },
    stepContainer: {
        width: width,
        padding: 24,
        flex: 1,
    },
    stepTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 8,
        textAlign: 'left',
    },
    stepSubtitle: {
        fontSize: 16,
        color: '#6B7280',
        marginBottom: 32,
        lineHeight: 24,
        textAlign: 'left',
    },
    optionsList: {
        flex: 1,
    },
    gridContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-between',
    },
    optionCard: {
        width: '47%',
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#E5E7EB',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        marginBottom: 8,
    },
    optionCardSelected: {
        borderColor: '#2D7F83',
        backgroundColor: '#F0F9FA',
    },
    flagText: {
        fontSize: 32,
        marginBottom: 8,
    },
    optionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
        marginBottom: 4,
    },
    optionTitleSelected: {
        color: '#2D7F83',
    },
    optionSubtitle: {
        fontSize: 14,
        color: '#9CA3AF',
    },
    optionSubtitleSelected: {
        color: '#5F9EA0',
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#F9FAFB',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        height: 100,
        textAlignVertical: 'top',
    },
    levelCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    levelCardSelected: {
        borderColor: '#2D7F83',
        backgroundColor: '#F0F9FA',
    },
    levelBadge: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    levelBadgeSelected: {
        backgroundColor: '#2D7F83',
    },
    levelBadgeText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6B7280',
    },
    levelBadgeTextSelected: {
        color: '#FFFFFF',
    },
    levelInfo: {
        flex: 1,
    },
    levelLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 4,
    },
    levelDesc: {
        fontSize: 14,
        color: '#6B7280',
    },
    summaryContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#E0F2F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 24,
    },
    summaryCard: {
        width: '100%',
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 24,
        marginTop: 32,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    summaryLabel: {
        fontSize: 16,
        color: '#6B7280',
    },
    summaryValue: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1F2937',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    nextButton: {
        backgroundColor: '#2D7F83',
        paddingVertical: 18,
        borderRadius: 16,
        alignItems: 'center',
        shadowColor: '#2D7F83',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    nextButtonDisabled: {
        backgroundColor: '#D1D5DB',
        shadowOpacity: 0,
    },
    nextButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default CourseSetupScreen;
