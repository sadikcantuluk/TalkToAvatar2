import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Modal,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const TopicSelector = ({ selectedTopic, onTopicChange, topics = [], style, textColor, labelColor }) => {
    const [modalVisible, setModalVisible] = useState(false);

    // Helper to find topic object
    const currentTopic = topics.find(t => t.topic === selectedTopic?.topic) || selectedTopic || topics[0] || { title: 'Select Topic' };

    // Use provided colors or defaults
    const mainTextColor = textColor || COLORS.textLight;
    const secondaryTextColor = labelColor || COLORS.gray[400];

    const handleSelect = (topic) => {
        onTopicChange(topic);
        setModalVisible(false);
    };

    const getIconName = (topicId) => {
        switch (topicId) {
            case 'directions': return 'map';
            case 'accommodation': return 'bed';
            case 'greetings': return 'hand-left';
            case 'ordering': return 'restaurant';
            case 'food': return 'fast-food';
            default: return 'book'; // Default icon
        }
    };

    return (
        <>
            <TouchableOpacity
                style={[styles.selector, style]}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.7}
            >
                <View style={styles.topicInfo}>
                    <Text style={[styles.topicName, { color: mainTextColor }]}>{currentTopic.title}</Text>
                    {currentTopic.progress !== undefined && (
                        <Text style={[styles.topicProgress, { color: secondaryTextColor }]}>
                            {currentTopic.progress > 0 ? `${currentTopic.progress}% Complete` : 'Start Practice'}
                        </Text>
                    )}
                </View>
                <Ionicons
                    name="chevron-down"
                    size={20}
                    color={mainTextColor === COLORS.textLight ? "rgba(255,255,255,0.6)" : COLORS.gray[500]}
                />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <TouchableOpacity
                        style={styles.modalBackdrop}
                        activeOpacity={1}
                        onPress={() => setModalVisible(false)}
                    />
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Topic</Text>
                            <TouchableOpacity
                                onPress={() => setModalVisible(false)}
                                style={styles.closeButton}
                            >
                                <Ionicons name="close" size={24} color="#6B7280" />
                            </TouchableOpacity>
                        </View>

                        <ScrollView
                            style={styles.topicList}
                            contentContainerStyle={styles.topicListContent}
                            showsVerticalScrollIndicator={true}
                        >
                            {topics.map((topic) => (
                                <TouchableOpacity
                                    key={topic.topic}
                                    style={[
                                        styles.topicOption,
                                        selectedTopic?.topic === topic.topic && styles.topicOptionSelected,
                                    ]}
                                    onPress={() => handleSelect(topic)}
                                    activeOpacity={0.7}
                                >
                                    <View style={[
                                        styles.iconCircle,
                                        selectedTopic?.topic === topic.topic ? styles.iconCircleSelected : {}
                                    ]}>
                                        <Ionicons
                                            name={getIconName(topic.topic)}
                                            size={20}
                                            color={selectedTopic?.topic === topic.topic ? '#FFFFFF' : COLORS.primary}
                                        />
                                    </View>

                                    <View style={styles.topicDetails}>
                                        <Text style={[
                                            styles.topicOptionName,
                                            selectedTopic?.topic === topic.topic && styles.topicOptionNameSelected,
                                        ]}>
                                            {topic.title}
                                        </Text>
                                        <Text style={styles.topicOptionProgress}>
                                            {topic.progress > 0 ? `${topic.progress}% Completed` : 'Not Started'}
                                        </Text>
                                    </View>

                                    {selectedTopic?.topic === topic.topic && (
                                        <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    selector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 60, // Slightly taller for progress text
        paddingHorizontal: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 16, // Matching other inputs/selectors
    },
    topicInfo: {
        flex: 1,
    },
    topicName: {
        fontSize: SIZES.body2,
        fontWeight: '600',
        color: '#1F2937',
    },
    topicProgress: {
        fontSize: SIZES.body4,
        color: '#6B7280',
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'transparent',
    },
    modalBackdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        maxHeight: SCREEN_HEIGHT * 0.7,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        overflow: 'hidden',
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 0, // No separator as per new design
    },
    modalTitle: {
        fontSize: SIZES.h3,
        fontWeight: 'bold',
        color: '#1F2937',
    },
    closeButton: {
        padding: 4,
    },
    topicList: {
        flexGrow: 0,
    },
    topicListContent: {
        paddingBottom: 8,
    },
    topicOption: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12, // Slightly tighter
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F6',
        gap: 16,
    },
    topicOptionSelected: {
        backgroundColor: 'rgba(19, 127, 236, 0.05)',
    },
    iconCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconCircleSelected: {
        backgroundColor: COLORS.primary,
    },
    topicDetails: {
        flex: 1,
    },
    topicOptionName: {
        fontSize: SIZES.body2,
        fontWeight: '600',
        color: '#1F2937',
    },
    topicOptionNameSelected: {
        color: COLORS.primary,
    },
    topicOptionProgress: {
        fontSize: SIZES.body4,
        color: '#6B7280',
        marginTop: 2,
    },
});

export default TopicSelector;
