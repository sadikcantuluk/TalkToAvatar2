import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    SafeAreaView,
    StatusBar,
    Image,
    Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SIZES } from '../constants/theme';
import { useAuth } from '../context';

const THEME = {
    primary: '#2D7F83',
    background: '#F9FAFB', // Light gray background
    cardBg: '#FFFFFF',
    text: '#1F2937',
    textSecondary: '#6B7280',
};

const DashboardScreen = ({ navigation }) => {
    const { user } = useAuth();

    const features = [
        {
            id: 'courses',
            title: 'Sualingo',
            description: 'Master pronunciation and elevate your language skills.',
            icon: 'school',
            color: '#10B981',
            route: 'Courses', // Updated from 'Sualingo' to 'Courses'
        },
        {
            id: 'video',
            title: 'Video Creation',
            description: 'Create stunning videos with AI avatars.',
            icon: 'videocam',
            color: '#3B82F6',
            route: 'AvatarToVideo',
        },
        {
            id: 'travel',
            title: 'Travel Assistant',
            description: 'Your AI companion for travel insights.',
            icon: 'airplane',
            color: '#F59E0B',
            route: 'TravelAssistant',
        },
        {
            id: 'tts',
            title: 'TTS Avatar',
            description: 'Convert text to lifelike speech.',
            icon: 'mic',
            color: '#6366F1',
            route: 'TextToSpeech', // Updated to match likely AppNavigator route
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={THEME.background} />

            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello,</Text>
                    <Text style={styles.username}>{user?.username || 'User'}</Text>
                </View>
                <TouchableOpacity
                    style={styles.profileButton}
                    onPress={() => navigation.navigate('Profile')}
                >
                    {/* Placeholder Avatar */}
                    <View style={styles.avatarPlaceholder}>
                        <Text style={styles.avatarText}>
                            {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>

            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.sectionTitle}>Explore Features</Text>

                <View style={styles.grid}>
                    {features.map((feature) => (
                        <TouchableOpacity
                            key={feature.id}
                            style={styles.card}
                            onPress={() => navigation.navigate(feature.route)}
                            activeOpacity={0.8}
                        >
                            <View style={[styles.iconContainer, { backgroundColor: `${feature.color}15` }]}>
                                <Ionicons name={feature.icon} size={32} color={feature.color} />
                            </View>
                            <Text style={styles.cardTitle}>{feature.title}</Text>
                            <Text style={styles.cardDescription} numberOfLines={2}>
                                {feature.description}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Profile Card / My Avatar Shortcut */}
                <TouchableOpacity
                    style={styles.wideCard}
                    onPress={() => navigation.navigate('Profile')}
                    activeOpacity={0.8}
                >
                    <View style={styles.wideCardContent}>
                        <View>
                            <Text style={styles.wideCardTitle}>My Profile</Text>
                            <Text style={styles.wideCardDesc}>Manage your account and settings</Text>
                        </View>
                        <Ionicons name="person-circle-outline" size={48} color={THEME.primary} />
                    </View>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: THEME.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 20,
        marginTop: Platform.OS === 'android' ? 30 : 10, // Added padding for Android status bar
    },
    greeting: {
        fontSize: 16,
        color: THEME.textSecondary,
    },
    username: {
        fontSize: 24,
        fontWeight: 'bold',
        color: THEME.text,
    },
    profileButton: {
        padding: 4,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: THEME.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: 'bold',
    },
    content: {
        paddingHorizontal: 24,
        paddingBottom: 40,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 16,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 16,
        marginBottom: 24,
    },
    card: {
        width: '47%', // Slightly less than 50% to account for gap/margin
        backgroundColor: THEME.cardBg,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
        marginBottom: 8,
    },
    iconContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 4,
    },
    cardDescription: {
        fontSize: 12,
        color: THEME.textSecondary,
        lineHeight: 16,
    },
    wideCard: {
        backgroundColor: THEME.cardBg,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    wideCardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    wideCardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: THEME.text,
        marginBottom: 4,
    },
    wideCardDesc: {
        fontSize: 14,
        color: THEME.textSecondary,
    },
});

export default DashboardScreen;
