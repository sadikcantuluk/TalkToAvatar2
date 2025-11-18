-- =====================================================
-- Practice Sentences - Tüm Diller ve Seviyeler
-- =====================================================
-- Bu SQL dosyası tüm desteklenen diller (en, tr, es, fr, de, it, pt, ar)
-- ve tüm seviyeler (A1, A2, B1, B2, C1, C2) için cümleler içerir.
-- 
-- Her dil için 5 topic:
-- 1. greetings (Tanışma)
-- 2. ordering (Sipariş/Alışveriş)
-- 3. directions (Yön Tarifi/Ulaşım)
-- 4. food (Yemek/Restoran)
-- 5. accommodation (Konaklama/Seyahat)
--
-- Her topic için her seviyede 10-15 cümle
-- =====================================================

-- NOT: Mevcut A1 seviyesi kayıtlarını korumak için
-- Bu dosyayı çalıştırmadan önce mevcut A1 kayıtlarını kontrol edin
-- Eğer zaten varsa, sadece A2-C2 seviyelerini ekleyin

-- =====================================================
-- ENGLISH (en) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'A2', 'greetings', 'Good morning! How did you sleep?', 1),
('en', 'A2', 'greetings', 'It is a pleasure to meet you.', 2),
('en', 'A2', 'greetings', 'How have you been lately?', 3),
('en', 'A2', 'greetings', 'I have been doing well, thanks for asking.', 4),
('en', 'A2', 'greetings', 'What brings you here today?', 5),
('en', 'A2', 'greetings', 'I hope we can stay in touch.', 6),
('en', 'A2', 'greetings', 'It was nice catching up with you.', 7),
('en', 'A2', 'greetings', 'Take care and see you soon!', 8),
('en', 'A2', 'greetings', 'I look forward to seeing you again.', 9),
('en', 'A2', 'greetings', 'Have a wonderful day ahead!', 10),
('en', 'A2', 'greetings', 'Thank you for your time.', 11),
('en', 'A2', 'greetings', 'I appreciate you taking the time to meet.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'A2', 'ordering', 'Could I see the menu, please?', 1),
('en', 'A2', 'ordering', 'What would you recommend?', 2),
('en', 'A2', 'ordering', 'I would like to try something local.', 3),
('en', 'A2', 'ordering', 'Is there a discount for students?', 4),
('en', 'A2', 'ordering', 'Can I get a receipt, please?', 5),
('en', 'A2', 'ordering', 'Do you offer gift wrapping?', 6),
('en', 'A2', 'ordering', 'I am looking for something specific.', 7),
('en', 'A2', 'ordering', 'Could you help me find this item?', 8),
('en', 'A2', 'ordering', 'What is your return policy?', 9),
('en', 'A2', 'ordering', 'I would like to exchange this, please.', 10),
('en', 'A2', 'ordering', 'Is this available in other colors?', 11),
('en', 'A2', 'ordering', 'Can I pay in installments?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'A2', 'directions', 'Could you tell me how to get to the museum?', 1),
('en', 'A2', 'directions', 'Is it within walking distance?', 2),
('en', 'A2', 'directions', 'How long will the journey take?', 3),
('en', 'A2', 'directions', 'Which platform does the train leave from?', 4),
('en', 'A2', 'directions', 'Do I need to change trains?', 5),
('en', 'A2', 'directions', 'Where can I buy a ticket?', 6),
('en', 'A2', 'directions', 'Is there a direct route?', 7),
('en', 'A2', 'directions', 'Could you point me in the right direction?', 8),
('en', 'A2', 'directions', 'I seem to be lost. Can you help?', 9),
('en', 'A2', 'directions', 'What is the best way to get there?', 10),
('en', 'A2', 'directions', 'Is parking available nearby?', 11),
('en', 'A2', 'directions', 'How much does a taxi cost to the airport?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'A2', 'food', 'Could we have a table by the window?', 1),
('en', 'A2', 'food', 'I would like to make a reservation for two.', 2),
('en', 'A2', 'food', 'What are the specials today?', 3),
('en', 'A2', 'food', 'I have a food allergy. Is this dish safe?', 4),
('en', 'A2', 'food', 'Could I have this without onions?', 5),
('en', 'A2', 'food', 'The food is excellent here!', 6),
('en', 'A2', 'food', 'Could I have the check, please?', 7),
('en', 'A2', 'food', 'Is the tip included in the bill?', 8),
('en', 'A2', 'food', 'I would like to order dessert.', 9),
('en', 'A2', 'food', 'Could I have a glass of water?', 10),
('en', 'A2', 'food', 'What do you recommend for a vegetarian?', 11),
('en', 'A2', 'food', 'The service here is very good.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'A2', 'accommodation', 'I made a reservation online.', 1),
('en', 'A2', 'accommodation', 'What time does breakfast start?', 2),
('en', 'A2', 'accommodation', 'Could I have a room with a view?', 3),
('en', 'A2', 'accommodation', 'Is there a gym or pool available?', 4),
('en', 'A2', 'accommodation', 'The room is very comfortable.', 5),
('en', 'A2', 'accommodation', 'Could I get extra pillows, please?', 6),
('en', 'A2', 'accommodation', 'I would like to extend my stay.', 7),
('en', 'A2', 'accommodation', 'What is your cancellation policy?', 8),
('en', 'A2', 'accommodation', 'Could you recommend nearby restaurants?', 9),
('en', 'A2', 'accommodation', 'Is there a shuttle to the airport?', 10),
('en', 'A2', 'accommodation', 'I need to check out early tomorrow.', 11),
('en', 'A2', 'accommodation', 'Could I store my luggage after checkout?', 12);

-- =====================================================
-- ENGLISH (en) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B1', 'greetings', 'It has been a while since we last met.', 1),
('en', 'B1', 'greetings', 'I would like to introduce you to my colleague.', 2),
('en', 'B1', 'greetings', 'How has your day been so far?', 3),
('en', 'B1', 'greetings', 'I hope everything is going well for you.', 4),
('en', 'B1', 'greetings', 'It is wonderful to see you again.', 5),
('en', 'B1', 'greetings', 'I have been meaning to get in touch.', 6),
('en', 'B1', 'greetings', 'Let us keep in contact more regularly.', 7),
('en', 'B1', 'greetings', 'I appreciate you making time for this meeting.', 8),
('en', 'B1', 'greetings', 'Thank you for coming on such short notice.', 9),
('en', 'B1', 'greetings', 'I look forward to our future collaboration.', 10),
('en', 'B1', 'greetings', 'It was a pleasure spending time with you.', 11),
('en', 'B1', 'greetings', 'I hope we can meet again soon.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B1', 'ordering', 'I am interested in purchasing this item.', 1),
('en', 'B1', 'ordering', 'Could you provide more information about this product?', 2),
('en', 'B1', 'ordering', 'What is the warranty period for this?', 3),
('en', 'B1', 'ordering', 'I would like to compare different options.', 4),
('en', 'B1', 'ordering', 'Do you offer any promotional discounts?', 5),
('en', 'B1', 'ordering', 'Could I see this in a different size?', 6),
('en', 'B1', 'ordering', 'I am looking for something more affordable.', 7),
('en', 'B1', 'ordering', 'What payment methods do you accept?', 8),
('en', 'B1', 'ordering', 'Could you hold this item for me until tomorrow?', 9),
('en', 'B1', 'ordering', 'I would like to return this purchase.', 10),
('en', 'B1', 'ordering', 'What is your exchange policy?', 11),
('en', 'B1', 'ordering', 'Could I get a gift receipt for this?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B1', 'directions', 'I need to find the quickest route to the city center.', 1),
('en', 'B1', 'directions', 'Could you explain the best way to get there?', 2),
('en', 'B1', 'directions', 'Is there public transportation available?', 3),
('en', 'B1', 'directions', 'How much would a taxi cost approximately?', 4),
('en', 'B1', 'directions', 'I prefer to use the subway system.', 5),
('en', 'B1', 'directions', 'Could you show me on the map where we are?', 6),
('en', 'B1', 'directions', 'I am not familiar with this area.', 7),
('en', 'B1', 'directions', 'What landmarks should I look for?', 8),
('en', 'B1', 'directions', 'Is it safe to walk there at this time?', 9),
('en', 'B1', 'directions', 'Could you recommend a reliable taxi service?', 10),
('en', 'B1', 'directions', 'I need to catch a flight, so time is important.', 11),
('en', 'B1', 'directions', 'Are there any road closures I should know about?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B1', 'food', 'I would like to make a dinner reservation for this weekend.', 1),
('en', 'B1', 'food', 'Do you have any vegetarian options on the menu?', 2),
('en', 'B1', 'food', 'I have dietary restrictions. Can you accommodate them?', 3),
('en', 'B1', 'food', 'What is the chef''s recommendation for today?', 4),
('en', 'B1', 'food', 'Could I have this dish prepared without dairy?', 5),
('en', 'B1', 'food', 'The presentation of the food is impressive.', 6),
('en', 'B1', 'food', 'I would like to compliment the chef on this meal.', 7),
('en', 'B1', 'food', 'Could we split the bill, please?', 8),
('en', 'B1', 'food', 'Is there a service charge included?', 9),
('en', 'B1', 'food', 'I would like to order a bottle of wine.', 10),
('en', 'B1', 'food', 'Could you recommend a good local restaurant?', 11),
('en', 'B1', 'food', 'The atmosphere here is very pleasant.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B1', 'accommodation', 'I booked a room through your website.', 1),
('en', 'B1', 'accommodation', 'What amenities are included in the room?', 2),
('en', 'B1', 'accommodation', 'I would prefer a room on a higher floor.', 3),
('en', 'B1', 'accommodation', 'Is there room service available?', 4),
('en', 'B1', 'accommodation', 'Could I have a late checkout, please?', 5),
('en', 'B1', 'accommodation', 'I need to cancel my reservation.', 6),
('en', 'B1', 'accommodation', 'What is your policy on pets?', 7),
('en', 'B1', 'accommodation', 'Could you arrange airport transportation?', 8),
('en', 'B1', 'accommodation', 'I would like to extend my reservation by one night.', 9),
('en', 'B1', 'accommodation', 'Are there any tourist attractions nearby?', 10),
('en', 'B1', 'accommodation', 'Could you provide a map of the local area?', 11),
('en', 'B1', 'accommodation', 'I am very satisfied with the service here.', 12);

-- =====================================================
-- ENGLISH (en) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B2', 'greetings', 'I have been looking forward to this meeting.', 1),
('en', 'B2', 'greetings', 'It is an honor to make your acquaintance.', 2),
('en', 'B2', 'greetings', 'I hope we can establish a productive relationship.', 3),
('en', 'B2', 'greetings', 'Thank you for taking the time out of your busy schedule.', 4),
('en', 'B2', 'greetings', 'I appreciate the opportunity to connect with you.', 5),
('en', 'B2', 'greetings', 'Let us maintain regular communication going forward.', 6),
('en', 'B2', 'greetings', 'I value our professional relationship.', 7),
('en', 'B2', 'greetings', 'It was a pleasure discussing this matter with you.', 8),
('en', 'B2', 'greetings', 'I look forward to our continued collaboration.', 9),
('en', 'B2', 'greetings', 'Thank you for your hospitality and warm welcome.', 10),
('en', 'B2', 'greetings', 'I hope we can meet again under better circumstances.', 11),
('en', 'B2', 'greetings', 'I am grateful for your time and consideration.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B2', 'ordering', 'I am considering making a significant purchase.', 1),
('en', 'B2', 'ordering', 'Could you provide detailed specifications for this product?', 2),
('en', 'B2', 'ordering', 'I would like to negotiate the terms of this transaction.', 3),
('en', 'B2', 'ordering', 'What are the financing options available?', 4),
('en', 'B2', 'ordering', 'I need to consult with someone before making a decision.', 5),
('en', 'B2', 'ordering', 'Could you offer a better price for a bulk purchase?', 6),
('en', 'B2', 'ordering', 'I am interested in your premium service package.', 7),
('en', 'B2', 'ordering', 'What is your policy regarding product defects?', 8),
('en', 'B2', 'ordering', 'I would like to arrange a payment plan.', 9),
('en', 'B2', 'ordering', 'Could you provide a detailed invoice for this purchase?', 10),
('en', 'B2', 'ordering', 'I need to return this item due to a manufacturing defect.', 11),
('en', 'B2', 'ordering', 'What is your customer satisfaction guarantee?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B2', 'directions', 'I need detailed directions to reach my destination efficiently.', 1),
('en', 'B2', 'directions', 'Could you suggest the most scenic route?', 2),
('en', 'B2', 'directions', 'I am concerned about traffic conditions at this time.', 3),
('en', 'B2', 'directions', 'What is the most reliable mode of transportation?', 4),
('en', 'B2', 'directions', 'I prefer to avoid toll roads if possible.', 5),
('en', 'B2', 'directions', 'Could you recommend a navigation app for this area?', 6),
('en', 'B2', 'directions', 'I need to coordinate multiple stops on my journey.', 7),
('en', 'B2', 'directions', 'What is the estimated travel time considering current conditions?', 8),
('en', 'B2', 'directions', 'I would like to know about alternative routes.', 9),
('en', 'B2', 'directions', 'Could you provide information about parking facilities?', 10),
('en', 'B2', 'directions', 'I need to arrange transportation for a group.', 11),
('en', 'B2', 'directions', 'What are the safety considerations for this route?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B2', 'food', 'I would like to make a reservation for a special occasion.', 1),
('en', 'B2', 'food', 'Could you accommodate a group of eight people?', 2),
('en', 'B2', 'food', 'I have specific dietary requirements that need to be considered.', 3),
('en', 'B2', 'food', 'What is the restaurant''s approach to sustainable sourcing?', 4),
('en', 'B2', 'food', 'I would like to discuss the wine pairing options.', 5),
('en', 'B2', 'food', 'The culinary experience here is exceptional.', 6),
('en', 'B2', 'food', 'I would like to provide feedback on the service quality.', 7),
('en', 'B2', 'food', 'Could we arrange a private dining area?', 8),
('en', 'B2', 'food', 'I am interested in the chef''s tasting menu.', 9),
('en', 'B2', 'food', 'What is your policy on bringing outside beverages?', 10),
('en', 'B2', 'food', 'I would like to organize a corporate dinner here.', 11),
('en', 'B2', 'food', 'The presentation and flavor combination is outstanding.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'B2', 'accommodation', 'I made a reservation through a third-party booking platform.', 1),
('en', 'B2', 'accommodation', 'What are the premium amenities available in your suites?', 2),
('en', 'B2', 'accommodation', 'I would like to request a room with specific features.', 3),
('en', 'B2', 'accommodation', 'Could you provide information about your loyalty program?', 4),
('en', 'B2', 'accommodation', 'I need to modify my reservation details.', 5),
('en', 'B2', 'accommodation', 'What is your policy regarding early check-in?', 6),
('en', 'B2', 'accommodation', 'I would like to arrange additional services during my stay.', 7),
('en', 'B2', 'accommodation', 'Could you recommend activities for business travelers?', 8),
('en', 'B2', 'accommodation', 'I need to discuss the cancellation terms in detail.', 9),
('en', 'B2', 'accommodation', 'What conference facilities do you have available?', 10),
('en', 'B2', 'accommodation', 'I would like to provide feedback on my experience.', 11),
('en', 'B2', 'accommodation', 'The level of service here exceeds my expectations.', 12);

-- =====================================================
-- ENGLISH (en) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C1', 'greetings', 'I have been anticipating this opportunity to connect with you.', 1),
('en', 'C1', 'greetings', 'It is a privilege to be introduced to such distinguished individuals.', 2),
('en', 'C1', 'greetings', 'I hope we can foster a mutually beneficial professional relationship.', 3),
('en', 'C1', 'greetings', 'Thank you for accommodating this meeting despite your demanding schedule.', 4),
('en', 'C1', 'greetings', 'I appreciate the chance to engage in meaningful dialogue with you.', 5),
('en', 'C1', 'greetings', 'Let us establish a framework for ongoing communication and collaboration.', 6),
('en', 'C1', 'greetings', 'I value the depth and quality of our professional interactions.', 7),
('en', 'C1', 'greetings', 'It was intellectually stimulating to exchange perspectives with you.', 8),
('en', 'C1', 'greetings', 'I look forward to exploring potential synergies between our organizations.', 9),
('en', 'C1', 'greetings', 'Thank you for your gracious hospitality and thoughtful arrangements.', 10),
('en', 'C1', 'greetings', 'I hope we can reconvene under more favorable circumstances.', 11),
('en', 'C1', 'greetings', 'I am deeply appreciative of your time and professional insights.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C1', 'ordering', 'I am evaluating this purchase as part of a larger procurement strategy.', 1),
('en', 'C1', 'ordering', 'Could you provide comprehensive technical documentation for this product?', 2),
('en', 'C1', 'ordering', 'I would like to engage in negotiations regarding the commercial terms.', 3),
('en', 'C1', 'ordering', 'What structured financing arrangements do you have available?', 4),
('en', 'C1', 'ordering', 'I need to conduct due diligence before finalizing this transaction.', 5),
('en', 'C1', 'ordering', 'Could you propose a volume discount structure for enterprise clients?', 6),
('en', 'C1', 'ordering', 'I am interested in your comprehensive service and support package.', 7),
('en', 'C1', 'ordering', 'What is your quality assurance and warranty framework?', 8),
('en', 'C1', 'ordering', 'I would like to establish a flexible payment arrangement.', 9),
('en', 'C1', 'ordering', 'Could you generate a detailed commercial invoice with itemized breakdown?', 10),
('en', 'C1', 'ordering', 'I need to initiate a return process due to non-compliance with specifications.', 11),
('en', 'C1', 'ordering', 'What is your customer satisfaction and dispute resolution mechanism?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C1', 'directions', 'I require comprehensive navigation guidance to optimize my travel itinerary.', 1),
('en', 'C1', 'directions', 'Could you recommend routes that offer both efficiency and scenic value?', 2),
('en', 'C1', 'directions', 'I am monitoring traffic patterns to determine optimal departure times.', 3),
('en', 'C1', 'directions', 'What transportation options provide the best reliability-to-cost ratio?', 4),
('en', 'C1', 'directions', 'I prefer to minimize toll expenses while maintaining reasonable travel time.', 5),
('en', 'C1', 'directions', 'Could you recommend navigation solutions that integrate real-time traffic data?', 6),
('en', 'C1', 'directions', 'I need to coordinate a multi-stop itinerary with time-sensitive appointments.', 7),
('en', 'C1', 'directions', 'What is the projected travel duration accounting for current traffic conditions?', 8),
('en', 'C1', 'directions', 'I would appreciate information about alternative routing strategies.', 9),
('en', 'C1', 'directions', 'Could you provide details about parking infrastructure and availability?', 10),
('en', 'C1', 'directions', 'I need to arrange transportation logistics for a corporate delegation.', 11),
('en', 'C1', 'directions', 'What safety and security considerations should inform route selection?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C1', 'food', 'I would like to arrange a reservation for a significant celebratory event.', 1),
('en', 'C1', 'food', 'Could you accommodate a substantial group while maintaining service quality?', 2),
('en', 'C1', 'food', 'I have complex dietary requirements that necessitate careful consideration.', 3),
('en', 'C1', 'food', 'What is the establishment''s commitment to sustainable and ethical sourcing practices?', 4),
('en', 'C1', 'food', 'I would like to consult with your sommelier regarding wine pairings.', 5),
('en', 'C1', 'food', 'The gastronomic experience here demonstrates exceptional culinary artistry.', 6),
('en', 'C1', 'food', 'I would like to provide comprehensive feedback on service delivery standards.', 7),
('en', 'C1', 'food', 'Could we arrange an exclusive dining space for our party?', 8),
('en', 'C1', 'food', 'I am interested in experiencing the chef''s degustation menu.', 9),
('en', 'C1', 'food', 'What is your policy regarding external beverage service and corkage fees?', 10),
('en', 'C1', 'food', 'I would like to organize a corporate hospitality event at your venue.', 11),
('en', 'C1', 'food', 'The presentation and flavor profile demonstrate sophisticated culinary technique.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C1', 'accommodation', 'I secured a reservation through an online travel aggregator platform.', 1),
('en', 'C1', 'accommodation', 'What premium amenities and services are available in your executive suites?', 2),
('en', 'C1', 'accommodation', 'I would like to request accommodations with specific functional requirements.', 3),
('en', 'C1', 'accommodation', 'Could you provide information about your guest loyalty and rewards program?', 4),
('en', 'C1', 'accommodation', 'I need to modify reservation parameters to accommodate changed circumstances.', 5),
('en', 'C1', 'accommodation', 'What is your policy framework regarding early check-in and late checkout?', 6),
('en', 'C1', 'accommodation', 'I would like to arrange supplementary concierge services during my stay.', 7),
('en', 'C1', 'accommodation', 'Could you recommend business-focused amenities and facilities?', 8),
('en', 'C1', 'accommodation', 'I need to review cancellation terms and conditions in detail.', 9),
('en', 'C1', 'accommodation', 'What conference and meeting facilities do you have available for corporate events?', 10),
('en', 'C1', 'accommodation', 'I would like to provide detailed feedback on my guest experience.', 11),
('en', 'C1', 'accommodation', 'The service delivery here consistently exceeds industry benchmarks.', 12);

-- =====================================================
-- ENGLISH (en) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C2', 'greetings', 'I have been eagerly anticipating this opportunity to establish a meaningful professional connection.', 1),
('en', 'C2', 'greetings', 'It is indeed an honor to be introduced to such accomplished and distinguished professionals.', 2),
('en', 'C2', 'greetings', 'I hope we can cultivate a mutually advantageous and enduring professional relationship.', 3),
('en', 'C2', 'greetings', 'Thank you for graciously accommodating this meeting despite your extremely demanding schedule.', 4),
('en', 'C2', 'greetings', 'I deeply appreciate the opportunity to engage in substantive and intellectually stimulating dialogue.', 5),
('en', 'C2', 'greetings', 'Let us establish a robust framework for sustained communication and strategic collaboration.', 6),
('en', 'C2', 'greetings', 'I highly value the sophistication and depth of our professional interactions.', 7),
('en', 'C2', 'greetings', 'It was intellectually enriching to exchange nuanced perspectives and insights with you.', 8),
('en', 'C2', 'greetings', 'I look forward to exploring potential synergies and collaborative opportunities between our organizations.', 9),
('en', 'C2', 'greetings', 'Thank you for your exceptional hospitality and meticulously thoughtful arrangements.', 10),
('en', 'C2', 'greetings', 'I hope we can reconvene under circumstances that are even more conducive to productive discourse.', 11),
('en', 'C2', 'greetings', 'I am profoundly appreciative of your valuable time and insightful professional contributions.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C2', 'ordering', 'I am conducting a comprehensive evaluation of this purchase within the context of our broader procurement strategy.', 1),
('en', 'C2', 'ordering', 'Could you provide exhaustive technical documentation and compliance certifications for this product?', 2),
('en', 'C2', 'ordering', 'I would like to engage in sophisticated negotiations regarding the commercial and contractual terms.', 3),
('en', 'C2', 'ordering', 'What structured financing arrangements and payment terms do you have available for enterprise clients?', 4),
('en', 'C2', 'ordering', 'I need to conduct thorough due diligence and risk assessment before finalizing this transaction.', 5),
('en', 'C2', 'ordering', 'Could you propose a comprehensive volume discount structure with tiered pricing for large-scale procurement?', 6),
('en', 'C2', 'ordering', 'I am interested in your premium service package that includes comprehensive support and maintenance.', 7),
('en', 'C2', 'ordering', 'What is your quality assurance framework, warranty coverage, and post-sale support infrastructure?', 8),
('en', 'C2', 'ordering', 'I would like to establish a flexible payment arrangement that accommodates our financial planning cycles.', 9),
('en', 'C2', 'ordering', 'Could you generate a detailed commercial invoice with comprehensive itemized breakdown and tax documentation?', 10),
('en', 'C2', 'ordering', 'I need to initiate a formal return process due to non-compliance with specified technical requirements.', 11),
('en', 'C2', 'ordering', 'What is your comprehensive customer satisfaction guarantee and dispute resolution mechanism?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C2', 'directions', 'I require comprehensive navigation guidance to optimize my travel itinerary while minimizing transit time and cost.', 1),
('en', 'C2', 'directions', 'Could you recommend routes that offer an optimal balance between efficiency, scenic value, and safety considerations?', 2),
('en', 'C2', 'directions', 'I am monitoring real-time traffic patterns and historical data to determine the most opportune departure window.', 3),
('en', 'C2', 'directions', 'What transportation modalities provide the most favorable reliability-to-cost ratio for this particular journey?', 4),
('en', 'C2', 'directions', 'I prefer to minimize toll expenses while maintaining reasonable travel duration and route efficiency.', 5),
('en', 'C2', 'directions', 'Could you recommend advanced navigation solutions that integrate real-time traffic data and predictive analytics?', 6),
('en', 'C2', 'directions', 'I need to coordinate a complex multi-stop itinerary with time-sensitive appointments and logistical constraints.', 7),
('en', 'C2', 'directions', 'What is the projected travel duration accounting for current traffic conditions, potential delays, and route optimization?', 8),
('en', 'C2', 'directions', 'I would appreciate comprehensive information about alternative routing strategies and contingency planning.', 9),
('en', 'C2', 'directions', 'Could you provide detailed information about parking infrastructure, availability, pricing, and reservation options?', 10),
('en', 'C2', 'directions', 'I need to arrange sophisticated transportation logistics for a corporate delegation with specific requirements.', 11),
('en', 'C2', 'directions', 'What safety, security, and risk mitigation considerations should inform our route selection strategy?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C2', 'food', 'I would like to arrange a reservation for a significant celebratory event with specific requirements and expectations.', 1),
('en', 'C2', 'food', 'Could you accommodate a substantial group while maintaining exceptional service quality and attention to detail?', 2),
('en', 'C2', 'food', 'I have complex dietary requirements and preferences that necessitate careful consideration and customized preparation.', 3),
('en', 'C2', 'food', 'What is the establishment''s commitment to sustainable sourcing, ethical practices, and environmental responsibility?', 4),
('en', 'C2', 'food', 'I would like to consult with your sommelier regarding sophisticated wine pairings that complement the culinary experience.', 5),
('en', 'C2', 'food', 'The gastronomic experience here demonstrates exceptional culinary artistry and innovative flavor combinations.', 6),
('en', 'C2', 'food', 'I would like to provide comprehensive feedback on service delivery standards and overall dining experience.', 7),
('en', 'C2', 'food', 'Could we arrange an exclusive dining space that provides privacy and an enhanced atmosphere for our party?', 8),
('en', 'C2', 'food', 'I am interested in experiencing the chef''s degustation menu that showcases the full range of culinary capabilities.', 9),
('en', 'C2', 'food', 'What is your policy regarding external beverage service, corkage fees, and special occasion arrangements?', 10),
('en', 'C2', 'food', 'I would like to organize a corporate hospitality event at your venue with specific requirements and expectations.', 11),
('en', 'C2', 'food', 'The presentation, flavor profile, and culinary technique demonstrate sophisticated gastronomic expertise.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('en', 'C2', 'accommodation', 'I secured a reservation through an online travel aggregator platform and need to verify the details.', 1),
('en', 'C2', 'accommodation', 'What premium amenities, personalized services, and exclusive facilities are available in your executive suites?', 2),
('en', 'C2', 'accommodation', 'I would like to request accommodations with specific functional requirements and accessibility considerations.', 3),
('en', 'C2', 'accommodation', 'Could you provide comprehensive information about your guest loyalty program, rewards structure, and membership benefits?', 4),
('en', 'C2', 'accommodation', 'I need to modify reservation parameters to accommodate changed circumstances while maintaining favorable terms.', 5),
('en', 'C2', 'accommodation', 'What is your policy framework regarding early check-in, late checkout, and flexible accommodation arrangements?', 6),
('en', 'C2', 'accommodation', 'I would like to arrange supplementary concierge services and personalized assistance during my extended stay.', 7),
('en', 'C2', 'accommodation', 'Could you recommend business-focused amenities, facilities, and services for corporate travelers?', 8),
('en', 'C2', 'accommodation', 'I need to review cancellation terms, conditions, and potential financial implications in comprehensive detail.', 9),
('en', 'C2', 'accommodation', 'What conference facilities, meeting spaces, and event capabilities do you have available for corporate functions?', 10),
('en', 'C2', 'accommodation', 'I would like to provide detailed feedback on my guest experience and service delivery standards.', 11),
('en', 'C2', 'accommodation', 'The service delivery here consistently exceeds industry benchmarks and demonstrates exceptional hospitality standards.', 12);

-- =====================================================
-- TURKISH (tr) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'A2', 'greetings', 'Günaydın! Nasıl uyudunuz?', 1),
('tr', 'A2', 'greetings', 'Sizinle tanışmak bir zevk.', 2),
('tr', 'A2', 'greetings', 'Son zamanlarda nasılsınız?', 3),
('tr', 'A2', 'greetings', 'İyiyim, sorma zahmetine girdiğiniz için teşekkürler.', 4),
('tr', 'A2', 'greetings', 'Bugün buraya ne getirdi sizi?', 5),
('tr', 'A2', 'greetings', 'Umarım iletişimde kalabiliriz.', 6),
('tr', 'A2', 'greetings', 'Sizinle sohbet etmek güzeldi.', 7),
('tr', 'A2', 'greetings', 'Kendinize iyi bakın ve yakında görüşürüz!', 8),
('tr', 'A2', 'greetings', 'Sizi tekrar görmeyi dört gözle bekliyorum.', 9),
('tr', 'A2', 'greetings', 'Harika bir gün geçirmenizi dilerim!', 10),
('tr', 'A2', 'greetings', 'Zamanınız için teşekkür ederim.', 11),
('tr', 'A2', 'greetings', 'Bu görüşme için zaman ayırdığınız için minnettarım.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'A2', 'ordering', 'Menüyü görebilir miyim, lütfen?', 1),
('tr', 'A2', 'ordering', 'Ne önerirsiniz?', 2),
('tr', 'A2', 'ordering', 'Yerel bir şeyler denemek istiyorum.', 3),
('tr', 'A2', 'ordering', 'Öğrenciler için indirim var mı?', 4),
('tr', 'A2', 'ordering', 'Fiş alabilir miyim, lütfen?', 5),
('tr', 'A2', 'ordering', 'Hediye paketi yapıyor musunuz?', 6),
('tr', 'A2', 'ordering', 'Belirli bir şey arıyorum.', 7),
('tr', 'A2', 'ordering', 'Bu ürünü bulmama yardımcı olabilir misiniz?', 8),
('tr', 'A2', 'ordering', 'İade politikanız nedir?', 9),
('tr', 'A2', 'ordering', 'Bunu değiştirmek istiyorum, lütfen.', 10),
('tr', 'A2', 'ordering', 'Bunun başka renkleri var mı?', 11),
('tr', 'A2', 'ordering', 'Taksitle ödeyebilir miyim?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'A2', 'directions', 'Müzeye nasıl gideceğimi söyleyebilir misiniz?', 1),
('tr', 'A2', 'directions', 'Yürüme mesafesinde mi?', 2),
('tr', 'A2', 'directions', 'Yolculuk ne kadar sürer?', 3),
('tr', 'A2', 'directions', 'Tren hangi perondan kalkıyor?', 4),
('tr', 'A2', 'directions', 'Aktarma yapmam gerekiyor mu?', 5),
('tr', 'A2', 'directions', 'Bilet nereden alabilirim?', 6),
('tr', 'A2', 'directions', 'Direkt bir rota var mı?', 7),
('tr', 'A2', 'directions', 'Bana doğru yönü gösterebilir misiniz?', 8),
('tr', 'A2', 'directions', 'Sanırım kayboldum. Yardımcı olabilir misiniz?', 9),
('tr', 'A2', 'directions', 'Oraya gitmenin en iyi yolu nedir?', 10),
('tr', 'A2', 'directions', 'Yakında park yeri var mı?', 11),
('tr', 'A2', 'directions', 'Havalimanına taksi ne kadar tutar?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'A2', 'food', 'Pencere kenarında bir masa alabilir miyiz?', 1),
('tr', 'A2', 'food', 'İki kişilik rezervasyon yaptırmak istiyorum.', 2),
('tr', 'A2', 'food', 'Bugünün özel yemekleri neler?', 3),
('tr', 'A2', 'food', 'Yemek alerjim var. Bu yemek güvenli mi?', 4),
('tr', 'A2', 'food', 'Bunu soğansız yapabilir misiniz?', 5),
('tr', 'A2', 'food', 'Buradaki yemek mükemmel!', 6),
('tr', 'A2', 'food', 'Hesabı alabilir miyim, lütfen?', 7),
('tr', 'A2', 'food', 'Bahşiş hesaba dahil mi?', 8),
('tr', 'A2', 'food', 'Tatlı sipariş etmek istiyorum.', 9),
('tr', 'A2', 'food', 'Bir bardak su alabilir miyim?', 10),
('tr', 'A2', 'food', 'Vejetaryenler için ne önerirsiniz?', 11),
('tr', 'A2', 'food', 'Buradaki servis çok iyi.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'A2', 'accommodation', 'Online rezervasyon yaptım.', 1),
('tr', 'A2', 'accommodation', 'Kahvaltı saat kaçta başlıyor?', 2),
('tr', 'A2', 'accommodation', 'Manzaralı bir oda alabilir miyim?', 3),
('tr', 'A2', 'accommodation', 'Spor salonu veya havuz var mı?', 4),
('tr', 'A2', 'accommodation', 'Oda çok rahat.', 5),
('tr', 'A2', 'accommodation', 'Ekstra yastık alabilir miyim, lütfen?', 6),
('tr', 'A2', 'accommodation', 'Konaklamamı uzatmak istiyorum.', 7),
('tr', 'A2', 'accommodation', 'İptal politikanız nedir?', 8),
('tr', 'A2', 'accommodation', 'Yakındaki restoranları önerebilir misiniz?', 9),
('tr', 'A2', 'accommodation', 'Havalimanı servisi var mı?', 10),
('tr', 'A2', 'accommodation', 'Yarın erken check-out yapmam gerekiyor.', 11),
('tr', 'A2', 'accommodation', 'Check-out sonrası bagajımı burada bırakabilir miyim?', 12);

-- =====================================================
-- TURKISH (tr) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B1', 'greetings', 'Son görüşmemizden bu yana bir süre geçti.', 1),
('tr', 'B1', 'greetings', 'Sizi meslektaşımla tanıştırmak istiyorum.', 2),
('tr', 'B1', 'greetings', 'Gününüz şimdiye kadar nasıl geçti?', 3),
('tr', 'B1', 'greetings', 'Umarım her şey yolunda gidiyordur.', 4),
('tr', 'B1', 'greetings', 'Sizi tekrar görmek harika.', 5),
('tr', 'B1', 'greetings', 'Sizinle iletişime geçmeyi planlıyordum.', 6),
('tr', 'B1', 'greetings', 'Daha düzenli iletişimde kalalım.', 7),
('tr', 'B1', 'greetings', 'Bu görüşme için zaman ayırdığınız için minnettarım.', 8),
('tr', 'B1', 'greetings', 'Kısa sürede geldiğiniz için teşekkür ederim.', 9),
('tr', 'B1', 'greetings', 'Gelecekteki iş birliğimizi dört gözle bekliyorum.', 10),
('tr', 'B1', 'greetings', 'Sizinle vakit geçirmek bir zevkti.', 11),
('tr', 'B1', 'greetings', 'Umarım yakında tekrar buluşabiliriz.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B1', 'ordering', 'Bu ürünü satın almayı düşünüyorum.', 1),
('tr', 'B1', 'ordering', 'Bu ürün hakkında daha fazla bilgi verebilir misiniz?', 2),
('tr', 'B1', 'ordering', 'Bunun garanti süresi ne kadar?', 3),
('tr', 'B1', 'ordering', 'Farklı seçenekleri karşılaştırmak istiyorum.', 4),
('tr', 'B1', 'ordering', 'Promosyon indirimi sunuyor musunuz?', 5),
('tr', 'B1', 'ordering', 'Bunu farklı bir bedende görebilir miyim?', 6),
('tr', 'B1', 'ordering', 'Daha uygun fiyatlı bir şey arıyorum.', 7),
('tr', 'B1', 'ordering', 'Hangi ödeme yöntemlerini kabul ediyorsunuz?', 8),
('tr', 'B1', 'ordering', 'Bu ürünü yarına kadar benim için ayırabilir misiniz?', 9),
('tr', 'B1', 'ordering', 'Bu satın alımı iade etmek istiyorum.', 10),
('tr', 'B1', 'ordering', 'Değişim politikanız nedir?', 11),
('tr', 'B1', 'ordering', 'Bunun için hediye fişi alabilir miyim?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B1', 'directions', 'Şehir merkezine en hızlı rotayı bulmam gerekiyor.', 1),
('tr', 'B1', 'directions', 'Oraya gitmenin en iyi yolunu açıklayabilir misiniz?', 2),
('tr', 'B1', 'directions', 'Toplu taşıma var mı?', 3),
('tr', 'B1', 'directions', 'Taksi yaklaşık ne kadar tutar?', 4),
('tr', 'B1', 'directions', 'Metro sistemini kullanmayı tercih ederim.', 5),
('tr', 'B1', 'directions', 'Haritada nerede olduğumuzu gösterebilir misiniz?', 6),
('tr', 'B1', 'directions', 'Bu bölgeye aşina değilim.', 7),
('tr', 'B1', 'directions', 'Hangi işaretleri aramalıyım?', 8),
('tr', 'B1', 'directions', 'Bu saatte oraya yürümek güvenli mi?', 9),
('tr', 'B1', 'directions', 'Güvenilir bir taksi servisi önerebilir misiniz?', 10),
('tr', 'B1', 'directions', 'Bir uçağa yetişmem gerekiyor, bu yüzden zaman önemli.', 11),
('tr', 'B1', 'directions', 'Bilmem gereken yol kapanışları var mı?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B1', 'food', 'Bu hafta sonu için akşam yemeği rezervasyonu yaptırmak istiyorum.', 1),
('tr', 'B1', 'food', 'Menüde vejetaryen seçenekler var mı?', 2),
('tr', 'B1', 'food', 'Diyet kısıtlamalarım var. Bunları karşılayabilir misiniz?', 3),
('tr', 'B1', 'food', 'Şefin bugün için önerisi nedir?', 4),
('tr', 'B1', 'food', 'Bu yemeği sütsüz hazırlayabilir misiniz?', 5),
('tr', 'B1', 'food', 'Yemeğin sunumu etkileyici.', 6),
('tr', 'B1', 'food', 'Şefi bu yemek için tebrik etmek istiyorum.', 7),
('tr', 'B1', 'food', 'Hesabı paylaşabilir miyiz, lütfen?', 8),
('tr', 'B1', 'food', 'Servis ücreti dahil mi?', 9),
('tr', 'B1', 'food', 'Bir şişe şarap sipariş etmek istiyorum.', 10),
('tr', 'B1', 'food', 'İyi bir yerel restoran önerebilir misiniz?', 11),
('tr', 'B1', 'food', 'Buradaki atmosfer çok hoş.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B1', 'accommodation', 'Web siteniz üzerinden bir oda rezerve ettim.', 1),
('tr', 'B1', 'accommodation', 'Odada hangi olanaklar dahil?', 2),
('tr', 'B1', 'accommodation', 'Daha yüksek bir katta oda tercih ederim.', 3),
('tr', 'B1', 'accommodation', 'Oda servisi var mı?', 4),
('tr', 'B1', 'accommodation', 'Geç check-out yapabilir miyim, lütfen?', 5),
('tr', 'B1', 'accommodation', 'Rezervasyonumu iptal etmem gerekiyor.', 6),
('tr', 'B1', 'accommodation', 'Evcil hayvan politikanız nedir?', 7),
('tr', 'B1', 'accommodation', 'Havalimanı ulaşımını ayarlayabilir misiniz?', 8),
('tr', 'B1', 'accommodation', 'Rezervasyonumu bir gece uzatmak istiyorum.', 9),
('tr', 'B1', 'accommodation', 'Yakında turistik yerler var mı?', 10),
('tr', 'B1', 'accommodation', 'Yerel bölgenin haritasını sağlayabilir misiniz?', 11),
('tr', 'B1', 'accommodation', 'Buradaki hizmetten çok memnunum.', 12);

-- =====================================================
-- TURKISH (tr) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B2', 'greetings', 'Bu görüşmeyi dört gözle bekliyordum.', 1),
('tr', 'B2', 'greetings', 'Sizinle tanışmak bir onurdur.', 2),
('tr', 'B2', 'greetings', 'Umarım verimli bir ilişki kurabiliriz.', 3),
('tr', 'B2', 'greetings', 'Yoğun programınızdan zaman ayırdığınız için teşekkür ederim.', 4),
('tr', 'B2', 'greetings', 'Sizinle bağlantı kurma fırsatını takdir ediyorum.', 5),
('tr', 'B2', 'greetings', 'İleride düzenli iletişim sürdürelim.', 6),
('tr', 'B2', 'greetings', 'Profesyonel ilişkimize değer veriyorum.', 7),
('tr', 'B2', 'greetings', 'Bu konuyu sizinle tartışmak bir zevkti.', 8),
('tr', 'B2', 'greetings', 'Devam eden iş birliğimizi dört gözle bekliyorum.', 9),
('tr', 'B2', 'greetings', 'Misafirperverliğiniz ve sıcak karşılamanız için teşekkür ederim.', 10),
('tr', 'B2', 'greetings', 'Umarım daha iyi koşullarda tekrar buluşabiliriz.', 11),
('tr', 'B2', 'greetings', 'Zamanınız ve düşünceli yaklaşımınız için minnettarım.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B2', 'ordering', 'Önemli bir satın alma yapmayı düşünüyorum.', 1),
('tr', 'B2', 'ordering', 'Bu ürün için detaylı özellikler sağlayabilir misiniz?', 2),
('tr', 'B2', 'ordering', 'Bu işlemin şartlarını görüşmek istiyorum.', 3),
('tr', 'B2', 'ordering', 'Mevcut finansman seçenekleri nelerdir?', 4),
('tr', 'B2', 'ordering', 'Karar vermeden önce biriyle görüşmem gerekiyor.', 5),
('tr', 'B2', 'ordering', 'Toplu alım için daha iyi bir fiyat sunabilir misiniz?', 6),
('tr', 'B2', 'ordering', 'Premium hizmet paketinizle ilgileniyorum.', 7),
('tr', 'B2', 'ordering', 'Ürün kusurları konusundaki politikanız nedir?', 8),
('tr', 'B2', 'ordering', 'Bir ödeme planı düzenlemek istiyorum.', 9),
('tr', 'B2', 'ordering', 'Bu satın alma için detaylı bir fatura sağlayabilir misiniz?', 10),
('tr', 'B2', 'ordering', 'Üretim hatası nedeniyle bu ürünü iade etmem gerekiyor.', 11),
('tr', 'B2', 'ordering', 'Müşteri memnuniyeti garantiniz nedir?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B2', 'directions', 'Hedefime verimli bir şekilde ulaşmak için detaylı yön talimatlarına ihtiyacım var.', 1),
('tr', 'B2', 'directions', 'En manzaralı rotayı önerebilir misiniz?', 2),
('tr', 'B2', 'directions', 'Bu saatte trafik koşulları hakkında endişeliyim.', 3),
('tr', 'B2', 'directions', 'En güvenilir ulaşım şekli nedir?', 4),
('tr', 'B2', 'directions', 'Mümkünse ücretli yollardan kaçınmayı tercih ederim.', 5),
('tr', 'B2', 'directions', 'Bu bölge için bir navigasyon uygulaması önerebilir misiniz?', 6),
('tr', 'B2', 'directions', 'Yolculuğumda birden fazla durağı koordine etmem gerekiyor.', 7),
('tr', 'B2', 'directions', 'Mevcut koşullar göz önüne alındığında tahmini seyahat süresi nedir?', 8),
('tr', 'B2', 'directions', 'Alternatif rotalar hakkında bilgi almak istiyorum.', 9),
('tr', 'B2', 'directions', 'Park tesisleri hakkında bilgi sağlayabilir misiniz?', 10),
('tr', 'B2', 'directions', 'Bir grup için ulaşım düzenlemem gerekiyor.', 11),
('tr', 'B2', 'directions', 'Bu rota için güvenlik değerlendirmeleri nelerdir?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B2', 'food', 'Özel bir etkinlik için rezervasyon yaptırmak istiyorum.', 1),
('tr', 'B2', 'food', 'Sekiz kişilik bir grubu karşılayabilir misiniz?', 2),
('tr', 'B2', 'food', 'Dikkate alınması gereken özel diyet gereksinimlerim var.', 3),
('tr', 'B2', 'food', 'Restoranın sürdürülebilir kaynak yaklaşımı nedir?', 4),
('tr', 'B2', 'food', 'Şarap eşleştirme seçeneklerini tartışmak istiyorum.', 5),
('tr', 'B2', 'food', 'Buradaki mutfak deneyimi olağanüstü.', 6),
('tr', 'B2', 'food', 'Servis kalitesi hakkında geri bildirim sağlamak istiyorum.', 7),
('tr', 'B2', 'food', 'Özel bir yemek alanı düzenleyebilir miyiz?', 8),
('tr', 'B2', 'food', 'Şefin tadım menüsüyle ilgileniyorum.', 9),
('tr', 'B2', 'food', 'Dışarıdan içecek getirme konusundaki politikanız nedir?', 10),
('tr', 'B2', 'food', 'Burada kurumsal bir yemek düzenlemek istiyorum.', 11),
('tr', 'B2', 'food', 'Sunum ve lezzet kombinasyonu mükemmel.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'B2', 'accommodation', 'Üçüncü taraf bir rezervasyon platformu üzerinden rezervasyon yaptım.', 1),
('tr', 'B2', 'accommodation', 'Suitlerinizde hangi premium olanaklar mevcut?', 2),
('tr', 'B2', 'accommodation', 'Belirli özelliklere sahip bir oda talep etmek istiyorum.', 3),
('tr', 'B2', 'accommodation', 'Sadakat programınız hakkında bilgi sağlayabilir misiniz?', 4),
('tr', 'B2', 'accommodation', 'Rezervasyon detaylarımı değiştirmem gerekiyor.', 5),
('tr', 'B2', 'accommodation', 'Erken check-in konusundaki politikanız nedir?', 6),
('tr', 'B2', 'accommodation', 'Konaklamam sırasında ek hizmetler düzenlemek istiyorum.', 7),
('tr', 'B2', 'accommodation', 'İş seyahatçileri için aktiviteler önerebilir misiniz?', 8),
('tr', 'B2', 'accommodation', 'İptal şartlarını detaylı olarak görüşmem gerekiyor.', 9),
('tr', 'B2', 'accommodation', 'Mevcut konferans tesisleriniz nelerdir?', 10),
('tr', 'B2', 'accommodation', 'Deneyimim hakkında geri bildirim sağlamak istiyorum.', 11),
('tr', 'B2', 'accommodation', 'Buradaki hizmet seviyesi beklentilerimi aşıyor.', 12);

-- =====================================================
-- TURKISH (tr) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C1', 'greetings', 'Sizinle bağlantı kurma fırsatını dört gözle bekliyordum.', 1),
('tr', 'C1', 'greetings', 'Böyle seçkin bireylerle tanıştırılmak bir ayrıcalıktır.', 2),
('tr', 'C1', 'greetings', 'Umarım karşılıklı yarar sağlayan bir profesyonel ilişki geliştirebiliriz.', 3),
('tr', 'C1', 'greetings', 'Yoğun programınıza rağmen bu görüşmeyi kabul ettiğiniz için teşekkür ederim.', 4),
('tr', 'C1', 'greetings', 'Sizinle anlamlı bir diyalog kurma şansını takdir ediyorum.', 5),
('tr', 'C1', 'greetings', 'Devam eden iletişim ve iş birliği için bir çerçeve oluşturalım.', 6),
('tr', 'C1', 'greetings', 'Profesyonel etkileşimlerimizin derinliğine ve kalitesine değer veriyorum.', 7),
('tr', 'C1', 'greetings', 'Sizinle bakış açılarını değiş tokuş etmek entelektüel olarak uyarıcıydı.', 8),
('tr', 'C1', 'greetings', 'Organizasyonlarımız arasındaki potansiyel sinerjileri keşfetmeyi dört gözle bekliyorum.', 9),
('tr', 'C1', 'greetings', 'Nezaketiniz ve düşünceli düzenlemeleriniz için teşekkür ederim.', 10),
('tr', 'C1', 'greetings', 'Umarım daha elverişli koşullarda tekrar bir araya gelebiliriz.', 11),
('tr', 'C1', 'greetings', 'Zamanınız ve profesyonel içgörüleriniz için derinden minnettarım.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C1', 'ordering', 'Bu satın alımı daha geniş bir tedarik stratejisinin parçası olarak değerlendiriyorum.', 1),
('tr', 'C1', 'ordering', 'Bu ürün için kapsamlı teknik dokümantasyon sağlayabilir misiniz?', 2),
('tr', 'C1', 'ordering', 'Ticari şartlar konusunda görüşmelere girmek istiyorum.', 3),
('tr', 'C1', 'ordering', 'Mevcut yapılandırılmış finansman düzenlemeleri nelerdir?', 4),
('tr', 'C1', 'ordering', 'Bu işlemi sonuçlandırmadan önce gerekli incelemeyi yapmam gerekiyor.', 5),
('tr', 'C1', 'ordering', 'Kurumsal müşteriler için bir hacim indirimi yapısı önerebilir misiniz?', 6),
('tr', 'C1', 'ordering', 'Kapsamlı hizmet ve destek paketinizle ilgileniyorum.', 7),
('tr', 'C1', 'ordering', 'Kalite güvencesi ve garanti çerçeveniz nedir?', 8),
('tr', 'C1', 'ordering', 'Esnek bir ödeme düzenlemesi kurmak istiyorum.', 9),
('tr', 'C1', 'ordering', 'Detaylı madde bazında dökümü olan ticari bir fatura oluşturabilir misiniz?', 10),
('tr', 'C1', 'ordering', 'Özelliklere uyumsuzluk nedeniyle bir iade süreci başlatmam gerekiyor.', 11),
('tr', 'C1', 'ordering', 'Müşteri memnuniyeti ve uyuşmazlık çözüm mekanizmanız nedir?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C1', 'directions', 'Seyahat programımı optimize etmek için kapsamlı navigasyon rehberliğine ihtiyacım var.', 1),
('tr', 'C1', 'directions', 'Hem verimlilik hem de manzara değeri sunan rotalar önerebilir misiniz?', 2),
('tr', 'C1', 'directions', 'Optimal kalkış zamanlarını belirlemek için trafik kalıplarını izliyorum.', 3),
('tr', 'C1', 'directions', 'En iyi güvenilirlik-maliyet oranını sağlayan ulaşım seçenekleri nelerdir?', 4),
('tr', 'C1', 'directions', 'Makul seyahat süresini korurken ücretli yol giderlerini minimize etmeyi tercih ederim.', 5),
('tr', 'C1', 'directions', 'Gerçek zamanlı trafik verilerini entegre eden navigasyon çözümleri önerebilir misiniz?', 6),
('tr', 'C1', 'directions', 'Zaman duyarlı randevularla çok duraklı bir program koordine etmem gerekiyor.', 7),
('tr', 'C1', 'directions', 'Mevcut trafik koşulları göz önüne alındığında öngörülen seyahat süresi nedir?', 8),
('tr', 'C1', 'directions', 'Alternatif yönlendirme stratejileri hakkında bilgi takdir ederim.', 9),
('tr', 'C1', 'directions', 'Park altyapısı ve mevcudiyeti hakkında detaylar sağlayabilir misiniz?', 10),
('tr', 'C1', 'directions', 'Kurumsal bir heyet için ulaşım lojistiği düzenlemem gerekiyor.', 11),
('tr', 'C1', 'directions', 'Rota seçimini bilgilendirmesi gereken güvenlik ve güvenlik değerlendirmeleri nelerdir?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C1', 'food', 'Önemli bir kutlama etkinliği için rezervasyon düzenlemek istiyorum.', 1),
('tr', 'C1', 'food', 'Hizmet kalitesini korurken önemli bir grubu karşılayabilir misiniz?', 2),
('tr', 'C1', 'food', 'Dikkatli değerlendirme gerektiren karmaşık diyet gereksinimlerim var.', 3),
('tr', 'C1', 'food', 'İşletmenizin sürdürülebilir ve etik kaynak uygulamalarına bağlılığı nedir?', 4),
('tr', 'C1', 'food', 'Şarap eşleştirmeleri konusunda sommelierinizle görüşmek istiyorum.', 5),
('tr', 'C1', 'food', 'Buradaki gastronomik deneyim olağanüstü mutfak sanatını gösteriyor.', 6),
('tr', 'C1', 'food', 'Hizmet sunum standartları hakkında kapsamlı geri bildirim sağlamak istiyorum.', 7),
('tr', 'C1', 'food', 'Partimiz için özel bir yemek alanı düzenleyebilir miyiz?', 8),
('tr', 'C1', 'food', 'Şefin tüm mutfak yeteneklerini sergileyen tadım menüsünü deneyimlemekle ilgileniyorum.', 9),
('tr', 'C1', 'food', 'Dış içecek hizmeti ve mantar ücreti konusundaki politikanız nedir?', 10),
('tr', 'C1', 'food', 'Mekanınızda kurumsal bir misafirperverlik etkinliği düzenlemek istiyorum.', 11),
('tr', 'C1', 'food', 'Sunum ve lezzet profili sofistike mutfak tekniğini gösteriyor.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C1', 'accommodation', 'Online bir seyahat toplayıcı platformu üzerinden rezervasyon yaptım.', 1),
('tr', 'C1', 'accommodation', 'Yönetici suitlerinizde hangi premium olanaklar ve hizmetler mevcut?', 2),
('tr', 'C1', 'accommodation', 'Belirli işlevsel gereksinimlere sahip konaklama talep etmek istiyorum.', 3),
('tr', 'C1', 'accommodation', 'Misafir sadakat ve ödül programınız hakkında bilgi sağlayabilir misiniz?', 4),
('tr', 'C1', 'accommodation', 'Değişen koşulları karşılamak için rezervasyon parametrelerini değiştirmem gerekiyor.', 5),
('tr', 'C1', 'accommodation', 'Erken check-in ve geç check-out konusundaki politika çerçeveniz nedir?', 6),
('tr', 'C1', 'accommodation', 'Konaklamam sırasında ek konsiyerj hizmetleri düzenlemek istiyorum.', 7),
('tr', 'C1', 'accommodation', 'İş odaklı olanaklar ve tesisler önerebilir misiniz?', 8),
('tr', 'C1', 'accommodation', 'İptal şartlarını ve koşullarını detaylı olarak gözden geçirmem gerekiyor.', 9),
('tr', 'C1', 'accommodation', 'Kurumsal etkinlikler için mevcut konferans ve toplantı tesisleriniz nelerdir?', 10),
('tr', 'C1', 'accommodation', 'Misafir deneyimim hakkında detaylı geri bildirim sağlamak istiyorum.', 11),
('tr', 'C1', 'accommodation', 'Buradaki hizmet sunumu sürekli olarak sektör kriterlerini aşıyor.', 12);

-- =====================================================
-- TURKISH (tr) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C2', 'greetings', 'Anlamlı bir profesyonel bağlantı kurma fırsatını büyük bir heyecanla bekliyordum.', 1),
('tr', 'C2', 'greetings', 'Böyle başarılı ve seçkin profesyonellerle tanıştırılmak gerçekten bir onurdur.', 2),
('tr', 'C2', 'greetings', 'Umarım karşılıklı avantajlı ve kalıcı bir profesyonel ilişki geliştirebiliriz.', 3),
('tr', 'C2', 'greetings', 'Son derece yoğun programınıza rağmen bu görüşmeyi nezaketle kabul ettiğiniz için teşekkür ederim.', 4),
('tr', 'C2', 'greetings', 'Sizinle özlü ve entelektüel olarak uyarıcı bir diyalog kurma fırsatını derinden takdir ediyorum.', 5),
('tr', 'C2', 'greetings', 'Sürdürülebilir iletişim ve stratejik iş birliği için sağlam bir çerçeve oluşturalım.', 6),
('tr', 'C2', 'greetings', 'Profesyonel etkileşimlerimizin sofistikasyonuna ve derinliğine büyük değer veriyorum.', 7),
('tr', 'C2', 'greetings', 'Sizinle nüanslı bakış açıları ve içgörüleri değiş tokuş etmek entelektüel olarak zenginleştiriciydi.', 8),
('tr', 'C2', 'greetings', 'Organizasyonlarımız arasındaki potansiyel sinerjileri ve iş birliği fırsatlarını keşfetmeyi dört gözle bekliyorum.', 9),
('tr', 'C2', 'greetings', 'Olağanüstü misafirperverliğiniz ve titizlikle düşünülmüş düzenlemeleriniz için teşekkür ederim.', 10),
('tr', 'C2', 'greetings', 'Umarım üretken söyleme daha da elverişli koşullarda tekrar bir araya gelebiliriz.', 11),
('tr', 'C2', 'greetings', 'Değerli zamanınız ve içgörülü profesyonel katkılarınız için derinden minnettarım.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C2', 'ordering', 'Bu satın alımı daha geniş tedarik stratejimiz bağlamında kapsamlı bir değerlendirme yapıyorum.', 1),
('tr', 'C2', 'ordering', 'Bu ürün için kapsamlı teknik dokümantasyon ve uyumluluk sertifikaları sağlayabilir misiniz?', 2),
('tr', 'C2', 'ordering', 'Ticari ve sözleşmesel şartlar konusunda sofistike görüşmelere girmek istiyorum.', 3),
('tr', 'C2', 'ordering', 'Kurumsal müşteriler için mevcut yapılandırılmış finansman düzenlemeleri ve ödeme şartları nelerdir?', 4),
('tr', 'C2', 'ordering', 'Bu işlemi sonuçlandırmadan önce kapsamlı gerekli inceleme ve risk değerlendirmesi yapmam gerekiyor.', 5),
('tr', 'C2', 'ordering', 'Büyük ölçekli tedarik için kademeli fiyatlandırmalı kapsamlı bir hacim indirimi yapısı önerebilir misiniz?', 6),
('tr', 'C2', 'ordering', 'Kapsamlı destek ve bakım içeren premium hizmet paketinizle ilgileniyorum.', 7),
('tr', 'C2', 'ordering', 'Kalite güvencesi çerçeveniz, garanti kapsamı ve satış sonrası destek altyapınız nedir?', 8),
('tr', 'C2', 'ordering', 'Finansal planlama döngülerimize uygun esnek bir ödeme düzenlemesi kurmak istiyorum.', 9),
('tr', 'C2', 'ordering', 'Kapsamlı madde bazında döküm ve vergi dokümantasyonu içeren detaylı ticari bir fatura oluşturabilir misiniz?', 10),
('tr', 'C2', 'ordering', 'Belirtilen teknik gereksinimlere uyumsuzluk nedeniyle resmi bir iade süreci başlatmam gerekiyor.', 11),
('tr', 'C2', 'ordering', 'Kapsamlı müşteri memnuniyeti garantiniz ve uyuşmazlık çözüm mekanizmanız nedir?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C2', 'directions', 'Seyahat programımı optimize ederken transit süresini ve maliyeti minimize etmek için kapsamlı navigasyon rehberliğine ihtiyacım var.', 1),
('tr', 'C2', 'directions', 'Verimlilik, manzara değeri ve güvenlik değerlendirmeleri arasında optimal denge sunan rotalar önerebilir misiniz?', 2),
('tr', 'C2', 'directions', 'En uygun kalkış penceresini belirlemek için gerçek zamanlı trafik kalıplarını ve geçmiş verileri izliyorum.', 3),
('tr', 'C2', 'directions', 'Bu özel yolculuk için en uygun güvenilirlik-maliyet oranını sağlayan ulaşım modaliteleri nelerdir?', 4),
('tr', 'C2', 'directions', 'Makul seyahat süresini ve rota verimliliğini korurken ücretli yol giderlerini minimize etmeyi tercih ederim.', 5),
('tr', 'C2', 'directions', 'Gerçek zamanlı trafik verilerini ve tahmine dayalı analitikleri entegre eden gelişmiş navigasyon çözümleri önerebilir misiniz?', 6),
('tr', 'C2', 'directions', 'Zaman duyarlı randevular ve lojistik kısıtlamalarla karmaşık çok duraklı bir program koordine etmem gerekiyor.', 7),
('tr', 'C2', 'directions', 'Mevcut trafik koşulları, potansiyel gecikmeler ve rota optimizasyonu göz önüne alındığında öngörülen seyahat süresi nedir?', 8),
('tr', 'C2', 'directions', 'Alternatif yönlendirme stratejileri ve acil durum planlaması hakkında kapsamlı bilgi takdir ederim.', 9),
('tr', 'C2', 'directions', 'Park altyapısı, mevcudiyeti, fiyatlandırması ve rezervasyon seçenekleri hakkında detaylı bilgi sağlayabilir misiniz?', 10),
('tr', 'C2', 'directions', 'Belirli gereksinimlere sahip kurumsal bir heyet için sofistike ulaşım lojistiği düzenlemem gerekiyor.', 11),
('tr', 'C2', 'directions', 'Rota seçim stratejimizi bilgilendirmesi gereken güvenlik, güvenlik ve risk azaltma değerlendirmeleri nelerdir?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C2', 'food', 'Belirli gereksinimler ve beklentilerle önemli bir kutlama etkinliği için rezervasyon düzenlemek istiyorum.', 1),
('tr', 'C2', 'food', 'Olağanüstü hizmet kalitesi ve detaylara dikkat korurken önemli bir grubu karşılayabilir misiniz?', 2),
('tr', 'C2', 'food', 'Dikkatli değerlendirme ve özelleştirilmiş hazırlık gerektiren karmaşık diyet gereksinimlerim ve tercihlerim var.', 3),
('tr', 'C2', 'food', 'İşletmenizin sürdürülebilir kaynak, etik uygulamalar ve çevresel sorumluluğa bağlılığı nedir?', 4),
('tr', 'C2', 'food', 'Mutfa deneyimini tamamlayan sofistike şarap eşleştirmeleri konusunda sommelierinizle görüşmek istiyorum.', 5),
('tr', 'C2', 'food', 'Buradaki gastronomik deneyim olağanüstü mutfak sanatını ve yenilikçi lezzet kombinasyonlarını gösteriyor.', 6),
('tr', 'C2', 'food', 'Hizmet sunum standartları ve genel yemek deneyimi hakkında kapsamlı geri bildirim sağlamak istiyorum.', 7),
('tr', 'C2', 'food', 'Partimiz için gizlilik ve geliştirilmiş atmosfer sağlayan özel bir yemek alanı düzenleyebilir miyiz?', 8),
('tr', 'C2', 'food', 'Tüm mutfak yeteneklerini sergileyen şefin tadım menüsünü deneyimlemekle ilgileniyorum.', 9),
('tr', 'C2', 'food', 'Dış içecek hizmeti, mantar ücreti ve özel etkinlik düzenlemeleri konusundaki politikanız nedir?', 10),
('tr', 'C2', 'food', 'Mekanınızda belirli gereksinimler ve beklentilerle kurumsal bir misafirperverlik etkinliği düzenlemek istiyorum.', 11),
('tr', 'C2', 'food', 'Sunum, lezzet profili ve mutfak tekniği sofistike gastronomik uzmanlığı gösteriyor.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('tr', 'C2', 'accommodation', 'Online bir seyahat toplayıcı platformu üzerinden rezervasyon yaptım ve detayları doğrulamam gerekiyor.', 1),
('tr', 'C2', 'accommodation', 'Yönetici suitlerinizde hangi premium olanaklar, kişiselleştirilmiş hizmetler ve özel tesisler mevcut?', 2),
('tr', 'C2', 'accommodation', 'Belirli işlevsel gereksinimler ve erişilebilirlik değerlendirmeleriyle konaklama talep etmek istiyorum.', 3),
('tr', 'C2', 'accommodation', 'Misafir sadakat programınız, ödül yapınız ve üyelik avantajları hakkında kapsamlı bilgi sağlayabilir misiniz?', 4),
('tr', 'C2', 'accommodation', 'Değişen koşulları karşılarken uygun şartları koruyarak rezervasyon parametrelerini değiştirmem gerekiyor.', 5),
('tr', 'C2', 'accommodation', 'Erken check-in, geç check-out ve esnek konaklama düzenlemeleri konusundaki politika çerçeveniz nedir?', 6),
('tr', 'C2', 'accommodation', 'Uzatılmış konaklamam sırasında ek konsiyerj hizmetleri ve kişiselleştirilmiş yardım düzenlemek istiyorum.', 7),
('tr', 'C2', 'accommodation', 'Kurumsal seyahatçiler için iş odaklı olanaklar, tesisler ve hizmetler önerebilir misiniz?', 8),
('tr', 'C2', 'accommodation', 'İptal şartlarını, koşullarını ve potansiyel mali sonuçlarını kapsamlı detayda gözden geçirmem gerekiyor.', 9),
('tr', 'C2', 'accommodation', 'Kurumsal işlevler için mevcut konferans tesisleri, toplantı alanları ve etkinlik yetenekleriniz nelerdir?', 10),
('tr', 'C2', 'accommodation', 'Misafir deneyimim ve hizmet sunum standartları hakkında detaylı geri bildirim sağlamak istiyorum.', 11),
('tr', 'C2', 'accommodation', 'Buradaki hizmet sunumu sürekli olarak sektör kriterlerini aşıyor ve olağanüstü misafirperverlik standartlarını gösteriyor.', 12);

-- =====================================================
-- SPANISH (es) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'A2', 'greetings', '¡Buenos días! ¿Cómo dormiste?', 1),
('es', 'A2', 'greetings', 'Es un placer conocerte.', 2),
('es', 'A2', 'greetings', '¿Cómo has estado últimamente?', 3),
('es', 'A2', 'greetings', 'He estado bien, gracias por preguntar.', 4),
('es', 'A2', 'greetings', '¿Qué te trae por aquí hoy?', 5),
('es', 'A2', 'greetings', 'Espero que podamos mantener el contacto.', 6),
('es', 'A2', 'greetings', 'Fue agradable ponernos al día.', 7),
('es', 'A2', 'greetings', '¡Cuídate y nos vemos pronto!', 8),
('es', 'A2', 'greetings', 'Espero verte de nuevo.', 9),
('es', 'A2', 'greetings', '¡Que tengas un día maravilloso!', 10),
('es', 'A2', 'greetings', 'Gracias por tu tiempo.', 11),
('es', 'A2', 'greetings', 'Aprecio que hayas tomado tiempo para esta reunión.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'A2', 'ordering', '¿Podría ver el menú, por favor?', 1),
('es', 'A2', 'ordering', '¿Qué recomendarías?', 2),
('es', 'A2', 'ordering', 'Me gustaría probar algo local.', 3),
('es', 'A2', 'ordering', '¿Hay descuento para estudiantes?', 4),
('es', 'A2', 'ordering', '¿Puedo tener un recibo, por favor?', 5),
('es', 'A2', 'ordering', '¿Ofrecen envoltorio para regalo?', 6),
('es', 'A2', 'ordering', 'Estoy buscando algo específico.', 7),
('es', 'A2', 'ordering', '¿Podrías ayudarme a encontrar este artículo?', 8),
('es', 'A2', 'ordering', '¿Cuál es su política de devolución?', 9),
('es', 'A2', 'ordering', 'Me gustaría cambiar esto, por favor.', 10),
('es', 'A2', 'ordering', '¿Está disponible en otros colores?', 11),
('es', 'A2', 'ordering', '¿Puedo pagar a plazos?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'A2', 'directions', '¿Podrías decirme cómo llegar al museo?', 1),
('es', 'A2', 'directions', '¿Está a poca distancia caminando?', 2),
('es', 'A2', 'directions', '¿Cuánto durará el viaje?', 3),
('es', 'A2', 'directions', '¿De qué plataforma sale el tren?', 4),
('es', 'A2', 'directions', '¿Necesito cambiar de tren?', 5),
('es', 'A2', 'directions', '¿Dónde puedo comprar un billete?', 6),
('es', 'A2', 'directions', '¿Hay una ruta directa?', 7),
('es', 'A2', 'directions', '¿Podrías indicarme la dirección correcta?', 8),
('es', 'A2', 'directions', 'Parece que me he perdido. ¿Puedes ayudarme?', 9),
('es', 'A2', 'directions', '¿Cuál es la mejor manera de llegar allí?', 10),
('es', 'A2', 'directions', '¿Hay estacionamiento disponible cerca?', 11),
('es', 'A2', 'directions', '¿Cuánto cuesta un taxi al aeropuerto?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'A2', 'food', '¿Podríamos tener una mesa junto a la ventana?', 1),
('es', 'A2', 'food', 'Me gustaría hacer una reserva para dos.', 2),
('es', 'A2', 'food', '¿Cuáles son los especiales de hoy?', 3),
('es', 'A2', 'food', 'Tengo una alergia alimentaria. ¿Es seguro este plato?', 4),
('es', 'A2', 'food', '¿Podría tener esto sin cebolla?', 5),
('es', 'A2', 'food', '¡La comida aquí es excelente!', 6),
('es', 'A2', 'food', '¿Podría tener la cuenta, por favor?', 7),
('es', 'A2', 'food', '¿Está incluida la propina en la cuenta?', 8),
('es', 'A2', 'food', 'Me gustaría pedir postre.', 9),
('es', 'A2', 'food', '¿Podría tener un vaso de agua?', 10),
('es', 'A2', 'food', '¿Qué recomiendas para un vegetariano?', 11),
('es', 'A2', 'food', 'El servicio aquí es muy bueno.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'A2', 'accommodation', 'Hice una reserva en línea.', 1),
('es', 'A2', 'accommodation', '¿A qué hora comienza el desayuno?', 2),
('es', 'A2', 'accommodation', '¿Podría tener una habitación con vista?', 3),
('es', 'A2', 'accommodation', '¿Hay gimnasio o piscina disponible?', 4),
('es', 'A2', 'accommodation', 'La habitación es muy cómoda.', 5),
('es', 'A2', 'accommodation', '¿Podría tener almohadas extra, por favor?', 6),
('es', 'A2', 'accommodation', 'Me gustaría extender mi estancia.', 7),
('es', 'A2', 'accommodation', '¿Cuál es su política de cancelación?', 8),
('es', 'A2', 'accommodation', '¿Podrías recomendar restaurantes cercanos?', 9),
('es', 'A2', 'accommodation', '¿Hay un servicio de transporte al aeropuerto?', 10),
('es', 'A2', 'accommodation', 'Necesito hacer el check-out temprano mañana.', 11),
('es', 'A2', 'accommodation', '¿Podría guardar mi equipaje después del check-out?', 12);

-- =====================================================
-- SPANISH (es) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B1', 'greetings', 'Ha pasado un tiempo desde que nos vimos por última vez.', 1),
('es', 'B1', 'greetings', 'Me gustaría presentarte a mi colega.', 2),
('es', 'B1', 'greetings', '¿Cómo ha sido tu día hasta ahora?', 3),
('es', 'B1', 'greetings', 'Espero que todo te vaya bien.', 4),
('es', 'B1', 'greetings', 'Es maravilloso verte de nuevo.', 5),
('es', 'B1', 'greetings', 'He estado pensando en ponerme en contacto.', 6),
('es', 'B1', 'greetings', 'Mantengamos el contacto más regularmente.', 7),
('es', 'B1', 'greetings', 'Aprecio que hayas hecho tiempo para esta reunión.', 8),
('es', 'B1', 'greetings', 'Gracias por venir con tan poco aviso.', 9),
('es', 'B1', 'greetings', 'Espero nuestra futura colaboración.', 10),
('es', 'B1', 'greetings', 'Fue un placer pasar tiempo contigo.', 11),
('es', 'B1', 'greetings', 'Espero que podamos encontrarnos de nuevo pronto.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B1', 'ordering', 'Estoy interesado en comprar este artículo.', 1),
('es', 'B1', 'ordering', '¿Podrías proporcionar más información sobre este producto?', 2),
('es', 'B1', 'ordering', '¿Cuál es el período de garantía para esto?', 3),
('es', 'B1', 'ordering', 'Me gustaría comparar diferentes opciones.', 4),
('es', 'B1', 'ordering', '¿Ofrecen algún descuento promocional?', 5),
('es', 'B1', 'ordering', '¿Podría ver esto en una talla diferente?', 6),
('es', 'B1', 'ordering', 'Estoy buscando algo más asequible.', 7),
('es', 'B1', 'ordering', '¿Qué métodos de pago aceptan?', 8),
('es', 'B1', 'ordering', '¿Podrías reservar este artículo para mí hasta mañana?', 9),
('es', 'B1', 'ordering', 'Me gustaría devolver esta compra.', 10),
('es', 'B1', 'ordering', '¿Cuál es su política de intercambio?', 11),
('es', 'B1', 'ordering', '¿Podría obtener un recibo de regalo para esto?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B1', 'directions', 'Necesito encontrar la ruta más rápida al centro de la ciudad.', 1),
('es', 'B1', 'directions', '¿Podrías explicar la mejor manera de llegar allí?', 2),
('es', 'B1', 'directions', '¿Hay transporte público disponible?', 3),
('es', 'B1', 'directions', '¿Cuánto costaría aproximadamente un taxi?', 4),
('es', 'B1', 'directions', 'Prefiero usar el sistema de metro.', 5),
('es', 'B1', 'directions', '¿Podrías mostrarme en el mapa dónde estamos?', 6),
('es', 'B1', 'directions', 'No estoy familiarizado con esta área.', 7),
('es', 'B1', 'directions', '¿Qué puntos de referencia debo buscar?', 8),
('es', 'B1', 'directions', '¿Es seguro caminar allí a esta hora?', 9),
('es', 'B1', 'directions', '¿Podrías recomendar un servicio de taxi confiable?', 10),
('es', 'B1', 'directions', 'Necesito tomar un vuelo, así que el tiempo es importante.', 11),
('es', 'B1', 'directions', '¿Hay cierres de carreteras que deba conocer?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B1', 'food', 'Me gustaría hacer una reserva para cenar este fin de semana.', 1),
('es', 'B1', 'food', '¿Tienen opciones vegetarianas en el menú?', 2),
('es', 'B1', 'food', 'Tengo restricciones dietéticas. ¿Pueden acomodarlas?', 3),
('es', 'B1', 'food', '¿Cuál es la recomendación del chef para hoy?', 4),
('es', 'B1', 'food', '¿Podría tener este plato preparado sin lácteos?', 5),
('es', 'B1', 'food', 'La presentación de la comida es impresionante.', 6),
('es', 'B1', 'food', 'Me gustaría felicitar al chef por esta comida.', 7),
('es', 'B1', 'food', '¿Podríamos dividir la cuenta, por favor?', 8),
('es', 'B1', 'food', '¿Hay un cargo por servicio incluido?', 9),
('es', 'B1', 'food', 'Me gustaría pedir una botella de vino.', 10),
('es', 'B1', 'food', '¿Podrías recomendar un buen restaurante local?', 11),
('es', 'B1', 'food', 'El ambiente aquí es muy agradable.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B1', 'accommodation', 'Reservé una habitación a través de su sitio web.', 1),
('es', 'B1', 'accommodation', '¿Qué comodidades están incluidas en la habitación?', 2),
('es', 'B1', 'accommodation', 'Preferiría una habitación en un piso más alto.', 3),
('es', 'B1', 'accommodation', '¿Hay servicio de habitaciones disponible?', 4),
('es', 'B1', 'accommodation', '¿Podría tener un check-out tardío, por favor?', 5),
('es', 'B1', 'accommodation', 'Necesito cancelar mi reserva.', 6),
('es', 'B1', 'accommodation', '¿Cuál es su política sobre mascotas?', 7),
('es', 'B1', 'accommodation', '¿Podrían organizar transporte al aeropuerto?', 8),
('es', 'B1', 'accommodation', 'Me gustaría extender mi reserva por una noche.', 9),
('es', 'B1', 'accommodation', '¿Hay atracciones turísticas cerca?', 10),
('es', 'B1', 'accommodation', '¿Podrían proporcionar un mapa del área local?', 11),
('es', 'B1', 'accommodation', 'Estoy muy satisfecho con el servicio aquí.', 12);

-- =====================================================
-- SPANISH (es) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B2', 'greetings', 'He estado esperando esta reunión.', 1),
('es', 'B2', 'greetings', 'Es un honor hacer tu conocimiento.', 2),
('es', 'B2', 'greetings', 'Espero que podamos establecer una relación productiva.', 3),
('es', 'B2', 'greetings', 'Gracias por tomar tiempo de tu apretada agenda.', 4),
('es', 'B2', 'greetings', 'Aprecio la oportunidad de conectarme contigo.', 5),
('es', 'B2', 'greetings', 'Mantengamos una comunicación regular de ahora en adelante.', 6),
('es', 'B2', 'greetings', 'Valoro nuestra relación profesional.', 7),
('es', 'B2', 'greetings', 'Fue un placer discutir este asunto contigo.', 8),
('es', 'B2', 'greetings', 'Espero nuestra colaboración continua.', 9),
('es', 'B2', 'greetings', 'Gracias por tu hospitalidad y cálida bienvenida.', 10),
('es', 'B2', 'greetings', 'Espero que podamos encontrarnos de nuevo bajo mejores circunstancias.', 11),
('es', 'B2', 'greetings', 'Estoy agradecido por tu tiempo y consideración.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B2', 'ordering', 'Estoy considerando hacer una compra significativa.', 1),
('es', 'B2', 'ordering', '¿Podrías proporcionar especificaciones detalladas para este producto?', 2),
('es', 'B2', 'ordering', 'Me gustaría negociar los términos de esta transacción.', 3),
('es', 'B2', 'ordering', '¿Cuáles son las opciones de financiamiento disponibles?', 4),
('es', 'B2', 'ordering', 'Necesito consultar con alguien antes de tomar una decisión.', 5),
('es', 'B2', 'ordering', '¿Podrías ofrecer un mejor precio para una compra al por mayor?', 6),
('es', 'B2', 'ordering', 'Estoy interesado en su paquete de servicio premium.', 7),
('es', 'B2', 'ordering', '¿Cuál es su política con respecto a defectos del producto?', 8),
('es', 'B2', 'ordering', 'Me gustaría organizar un plan de pago.', 9),
('es', 'B2', 'ordering', '¿Podrías proporcionar una factura detallada para esta compra?', 10),
('es', 'B2', 'ordering', 'Necesito devolver este artículo debido a un defecto de fabricación.', 11),
('es', 'B2', 'ordering', '¿Cuál es su garantía de satisfacción del cliente?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B2', 'directions', 'Necesito direcciones detalladas para llegar a mi destino de manera eficiente.', 1),
('es', 'B2', 'directions', '¿Podrías sugerir la ruta más pintoresca?', 2),
('es', 'B2', 'directions', 'Estoy preocupado por las condiciones de tráfico en este momento.', 3),
('es', 'B2', 'directions', '¿Cuál es el modo de transporte más confiable?', 4),
('es', 'B2', 'directions', 'Prefiero evitar las carreteras de peaje si es posible.', 5),
('es', 'B2', 'directions', '¿Podrías recomendar una aplicación de navegación para esta área?', 6),
('es', 'B2', 'directions', 'Necesito coordinar múltiples paradas en mi viaje.', 7),
('es', 'B2', 'directions', '¿Cuál es el tiempo de viaje estimado considerando las condiciones actuales?', 8),
('es', 'B2', 'directions', 'Me gustaría saber sobre rutas alternativas.', 9),
('es', 'B2', 'directions', '¿Podrías proporcionar información sobre instalaciones de estacionamiento?', 10),
('es', 'B2', 'directions', 'Necesito organizar transporte para un grupo.', 11),
('es', 'B2', 'directions', '¿Cuáles son las consideraciones de seguridad para esta ruta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B2', 'food', 'Me gustaría hacer una reserva para una ocasión especial.', 1),
('es', 'B2', 'food', '¿Podrían acomodar a un grupo de ocho personas?', 2),
('es', 'B2', 'food', 'Tengo requisitos dietéticos específicos que deben ser considerados.', 3),
('es', 'B2', 'food', '¿Cuál es el enfoque del restaurante hacia el abastecimiento sostenible?', 4),
('es', 'B2', 'food', 'Me gustaría discutir las opciones de maridaje de vinos.', 5),
('es', 'B2', 'food', 'La experiencia culinaria aquí es excepcional.', 6),
('es', 'B2', 'food', 'Me gustaría proporcionar comentarios sobre la calidad del servicio.', 7),
('es', 'B2', 'food', '¿Podríamos organizar un área de comedor privada?', 8),
('es', 'B2', 'food', 'Estoy interesado en el menú de degustación del chef.', 9),
('es', 'B2', 'food', '¿Cuál es su política sobre traer bebidas externas?', 10),
('es', 'B2', 'food', 'Me gustaría organizar una cena corporativa aquí.', 11),
('es', 'B2', 'food', 'La combinación de presentación y sabor es excepcional.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'B2', 'accommodation', 'Hice una reserva a través de una plataforma de reservas de terceros.', 1),
('es', 'B2', 'accommodation', '¿Cuáles son las comodidades premium disponibles en sus suites?', 2),
('es', 'B2', 'accommodation', 'Me gustaría solicitar una habitación con características específicas.', 3),
('es', 'B2', 'accommodation', '¿Podrían proporcionar información sobre su programa de lealtad?', 4),
('es', 'B2', 'accommodation', 'Necesito modificar los detalles de mi reserva.', 5),
('es', 'B2', 'accommodation', '¿Cuál es su política con respecto al check-in temprano?', 6),
('es', 'B2', 'accommodation', 'Me gustaría organizar servicios adicionales durante mi estancia.', 7),
('es', 'B2', 'accommodation', '¿Podrían recomendar actividades para viajeros de negocios?', 8),
('es', 'B2', 'accommodation', 'Necesito discutir los términos de cancelación en detalle.', 9),
('es', 'B2', 'accommodation', '¿Qué instalaciones de conferencias tienen disponibles?', 10),
('es', 'B2', 'accommodation', 'Me gustaría proporcionar comentarios sobre mi experiencia.', 11),
('es', 'B2', 'accommodation', 'El nivel de servicio aquí supera mis expectativas.', 12);

-- =====================================================
-- SPANISH (es) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C1', 'greetings', 'He estado anticipando esta oportunidad de conectarme contigo.', 1),
('es', 'C1', 'greetings', 'Es un privilegio ser presentado a individuos tan distinguidos.', 2),
('es', 'C1', 'greetings', 'Espero que podamos fomentar una relación profesional mutuamente beneficiosa.', 3),
('es', 'C1', 'greetings', 'Gracias por acomodar esta reunión a pesar de tu exigente agenda.', 4),
('es', 'C1', 'greetings', 'Aprecio la oportunidad de participar en un diálogo significativo contigo.', 5),
('es', 'C1', 'greetings', 'Establezcamos un marco para la comunicación y colaboración continua.', 6),
('es', 'C1', 'greetings', 'Valoro la profundidad y calidad de nuestras interacciones profesionales.', 7),
('es', 'C1', 'greetings', 'Fue intelectualmente estimulante intercambiar perspectivas contigo.', 8),
('es', 'C1', 'greetings', 'Espero explorar sinergias potenciales entre nuestras organizaciones.', 9),
('es', 'C1', 'greetings', 'Gracias por tu hospitalidad amable y arreglos considerados.', 10),
('es', 'C1', 'greetings', 'Espero que podamos reunirnos de nuevo bajo circunstancias más favorables.', 11),
('es', 'C1', 'greetings', 'Estoy profundamente agradecido por tu tiempo e ideas profesionales.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C1', 'ordering', 'Estoy evaluando esta compra como parte de una estrategia de adquisición más amplia.', 1),
('es', 'C1', 'ordering', '¿Podrías proporcionar documentación técnica integral para este producto?', 2),
('es', 'C1', 'ordering', 'Me gustaría participar en negociaciones con respecto a los términos comerciales.', 3),
('es', 'C1', 'ordering', '¿Qué arreglos de financiamiento estructurado tienen disponibles?', 4),
('es', 'C1', 'ordering', 'Necesito realizar una debida diligencia antes de finalizar esta transacción.', 5),
('es', 'C1', 'ordering', '¿Podrías proponer una estructura de descuento por volumen para clientes empresariales?', 6),
('es', 'C1', 'ordering', 'Estoy interesado en su paquete integral de servicio y soporte.', 7),
('es', 'C1', 'ordering', '¿Cuál es su marco de garantía de calidad y garantía?', 8),
('es', 'C1', 'ordering', 'Me gustaría establecer un arreglo de pago flexible.', 9),
('es', 'C1', 'ordering', '¿Podrías generar una factura comercial detallada con desglose por partidas?', 10),
('es', 'C1', 'ordering', 'Necesito iniciar un proceso de devolución debido al incumplimiento de las especificaciones.', 11),
('es', 'C1', 'ordering', '¿Cuál es su mecanismo de satisfacción del cliente y resolución de disputas?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C1', 'directions', 'Requiero orientación de navegación integral para optimizar mi itinerario de viaje.', 1),
('es', 'C1', 'directions', '¿Podrías recomendar rutas que ofrezcan tanto eficiencia como valor escénico?', 2),
('es', 'C1', 'directions', 'Estoy monitoreando patrones de tráfico para determinar tiempos de salida óptimos.', 3),
('es', 'C1', 'directions', '¿Qué opciones de transporte proporcionan la mejor relación confiabilidad-costo?', 4),
('es', 'C1', 'directions', 'Prefiero minimizar los gastos de peaje mientras mantengo un tiempo de viaje razonable.', 5),
('es', 'C1', 'directions', '¿Podrías recomendar soluciones de navegación que integren datos de tráfico en tiempo real?', 6),
('es', 'C1', 'directions', 'Necesito coordinar un itinerario de múltiples paradas con citas sensibles al tiempo.', 7),
('es', 'C1', 'directions', '¿Cuál es la duración proyectada del viaje considerando las condiciones actuales de tráfico?', 8),
('es', 'C1', 'directions', 'Apreciaría información sobre estrategias de enrutamiento alternativas.', 9),
('es', 'C1', 'directions', '¿Podrías proporcionar detalles sobre la infraestructura y disponibilidad de estacionamiento?', 10),
('es', 'C1', 'directions', 'Necesito organizar logística de transporte para una delegación corporativa.', 11),
('es', 'C1', 'directions', '¿Qué consideraciones de seguridad y protección deben informar la selección de ruta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C1', 'food', 'Me gustaría organizar una reserva para un evento celebratorio significativo.', 1),
('es', 'C1', 'food', '¿Podrían acomodar a un grupo sustancial mientras mantienen la calidad del servicio?', 2),
('es', 'C1', 'food', 'Tengo requisitos dietéticos complejos que requieren consideración cuidadosa.', 3),
('es', 'C1', 'food', '¿Cuál es el compromiso del establecimiento con las prácticas de abastecimiento sostenible y ético?', 4),
('es', 'C1', 'food', 'Me gustaría consultar con su sommelier con respecto a los maridajes de vinos.', 5),
('es', 'C1', 'food', 'La experiencia gastronómica aquí demuestra arte culinario excepcional.', 6),
('es', 'C1', 'food', 'Me gustaría proporcionar comentarios integrales sobre los estándares de entrega de servicio.', 7),
('es', 'C1', 'food', '¿Podríamos organizar un espacio de comedor exclusivo para nuestro grupo?', 8),
('es', 'C1', 'food', 'Estoy interesado en experimentar el menú de degustación del chef.', 9),
('es', 'C1', 'food', '¿Cuál es su política con respecto al servicio de bebidas externas y tarifas de corcho?', 10),
('es', 'C1', 'food', 'Me gustaría organizar un evento de hospitalidad corporativa en su lugar.', 11),
('es', 'C1', 'food', 'La presentación y el perfil de sabor demuestran técnica culinaria sofisticada.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C1', 'accommodation', 'Aseguré una reserva a través de una plataforma agregadora de viajes en línea.', 1),
('es', 'C1', 'accommodation', '¿Qué comodidades y servicios premium están disponibles en sus suites ejecutivas?', 2),
('es', 'C1', 'accommodation', 'Me gustaría solicitar alojamientos con requisitos funcionales específicos.', 3),
('es', 'C1', 'accommodation', '¿Podrían proporcionar información sobre su programa de lealtad y recompensas para huéspedes?', 4),
('es', 'C1', 'accommodation', 'Necesito modificar los parámetros de reserva para acomodar circunstancias cambiantes.', 5),
('es', 'C1', 'accommodation', '¿Cuál es su marco de política con respecto al check-in temprano y check-out tardío?', 6),
('es', 'C1', 'accommodation', 'Me gustaría organizar servicios de conserjería suplementarios durante mi estancia.', 7),
('es', 'C1', 'accommodation', '¿Podrían recomendar comodidades e instalaciones enfocadas en negocios?', 8),
('es', 'C1', 'accommodation', 'Necesito revisar los términos y condiciones de cancelación en detalle.', 9),
('es', 'C1', 'accommodation', '¿Qué instalaciones de conferencias y reuniones tienen disponibles para eventos corporativos?', 10),
('es', 'C1', 'accommodation', 'Me gustaría proporcionar comentarios detallados sobre mi experiencia como huésped.', 11),
('es', 'C1', 'accommodation', 'La entrega de servicio aquí consistentemente supera los puntos de referencia de la industria.', 12);

-- =====================================================
-- SPANISH (es) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C2', 'greetings', 'He estado esperando ansiosamente esta oportunidad de establecer una conexión profesional significativa.', 1),
('es', 'C2', 'greetings', 'Es realmente un honor ser presentado a profesionales tan logrados y distinguidos.', 2),
('es', 'C2', 'greetings', 'Espero que podamos cultivar una relación profesional mutuamente ventajosa y duradera.', 3),
('es', 'C2', 'greetings', 'Gracias por acomodar amablemente esta reunión a pesar de tu agenda extremadamente exigente.', 4),
('es', 'C2', 'greetings', 'Aprecio profundamente la oportunidad de participar en un diálogo sustantivo e intelectualmente estimulante.', 5),
('es', 'C2', 'greetings', 'Establezcamos un marco robusto para la comunicación sostenida y la colaboración estratégica.', 6),
('es', 'C2', 'greetings', 'Valoro altamente la sofisticación y profundidad de nuestras interacciones profesionales.', 7),
('es', 'C2', 'greetings', 'Fue intelectualmente enriquecedor intercambiar perspectivas e ideas matizadas contigo.', 8),
('es', 'C2', 'greetings', 'Espero explorar sinergias potenciales y oportunidades de colaboración entre nuestras organizaciones.', 9),
('es', 'C2', 'greetings', 'Gracias por tu hospitalidad excepcional y arreglos meticulosamente considerados.', 10),
('es', 'C2', 'greetings', 'Espero que podamos reunirnos de nuevo bajo circunstancias que sean aún más propicias para el discurso productivo.', 11),
('es', 'C2', 'greetings', 'Estoy profundamente agradecido por tu valioso tiempo y contribuciones profesionales perspicaces.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C2', 'ordering', 'Estoy realizando una evaluación integral de esta compra dentro del contexto de nuestra estrategia de adquisición más amplia.', 1),
('es', 'C2', 'ordering', '¿Podrías proporcionar documentación técnica exhaustiva y certificaciones de cumplimiento para este producto?', 2),
('es', 'C2', 'ordering', 'Me gustaría participar en negociaciones sofisticadas con respecto a los términos comerciales y contractuales.', 3),
('es', 'C2', 'ordering', '¿Qué arreglos de financiamiento estructurado y términos de pago tienen disponibles para clientes empresariales?', 4),
('es', 'C2', 'ordering', 'Necesito realizar una debida diligencia exhaustiva y evaluación de riesgos antes de finalizar esta transacción.', 5),
('es', 'C2', 'ordering', '¿Podrías proponer una estructura integral de descuento por volumen con precios escalonados para adquisiciones a gran escala?', 6),
('es', 'C2', 'ordering', 'Estoy interesado en su paquete de servicio premium que incluye soporte y mantenimiento integral.', 7),
('es', 'C2', 'ordering', '¿Cuál es su marco de garantía de calidad, cobertura de garantía e infraestructura de soporte postventa?', 8),
('es', 'C2', 'ordering', 'Me gustaría establecer un arreglo de pago flexible que acomode nuestros ciclos de planificación financiera.', 9),
('es', 'C2', 'ordering', '¿Podrías generar una factura comercial detallada con desglose integral por partidas y documentación fiscal?', 10),
('es', 'C2', 'ordering', 'Necesito iniciar un proceso de devolución formal debido al incumplimiento de los requisitos técnicos especificados.', 11),
('es', 'C2', 'ordering', '¿Cuál es su garantía integral de satisfacción del cliente y mecanismo de resolución de disputas?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C2', 'directions', 'Requiero orientación de navegación integral para optimizar mi itinerario de viaje mientras minimizo el tiempo de tránsito y el costo.', 1),
('es', 'C2', 'directions', '¿Podrías recomendar rutas que ofrezcan un equilibrio óptimo entre eficiencia, valor escénico y consideraciones de seguridad?', 2),
('es', 'C2', 'directions', 'Estoy monitoreando patrones de tráfico en tiempo real y datos históricos para determinar la ventana de salida más oportuna.', 3),
('es', 'C2', 'directions', '¿Qué modalidades de transporte proporcionan la relación confiabilidad-costo más favorable para este viaje particular?', 4),
('es', 'C2', 'directions', 'Prefiero minimizar los gastos de peaje mientras mantengo una duración de viaje razonable y eficiencia de ruta.', 5),
('es', 'C2', 'directions', '¿Podrías recomendar soluciones de navegación avanzadas que integren datos de tráfico en tiempo real y análisis predictivos?', 6),
('es', 'C2', 'directions', 'Necesito coordinar un itinerario complejo de múltiples paradas con citas sensibles al tiempo y restricciones logísticas.', 7),
('es', 'C2', 'directions', '¿Cuál es la duración proyectada del viaje considerando las condiciones actuales de tráfico, posibles retrasos y optimización de ruta?', 8),
('es', 'C2', 'directions', 'Apreciaría información integral sobre estrategias de enrutamiento alternativas y planificación de contingencia.', 9),
('es', 'C2', 'directions', '¿Podrías proporcionar información detallada sobre la infraestructura de estacionamiento, disponibilidad, precios y opciones de reserva?', 10),
('es', 'C2', 'directions', 'Necesito organizar logística de transporte sofisticada para una delegación corporativa con requisitos específicos.', 11),
('es', 'C2', 'directions', '¿Qué consideraciones de seguridad, protección y mitigación de riesgos deben informar nuestra estrategia de selección de ruta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C2', 'food', 'Me gustaría organizar una reserva para un evento celebratorio significativo con requisitos y expectativas específicas.', 1),
('es', 'C2', 'food', '¿Podrían acomodar a un grupo sustancial mientras mantienen una calidad de servicio excepcional y atención al detalle?', 2),
('es', 'C2', 'food', 'Tengo requisitos y preferencias dietéticas complejas que requieren consideración cuidadosa y preparación personalizada.', 3),
('es', 'C2', 'food', '¿Cuál es el compromiso del establecimiento con el abastecimiento sostenible, prácticas éticas y responsabilidad ambiental?', 4),
('es', 'C2', 'food', 'Me gustaría consultar con su sommelier con respecto a maridajes de vinos sofisticados que complementen la experiencia culinaria.', 5),
('es', 'C2', 'food', 'La experiencia gastronómica aquí demuestra arte culinario excepcional y combinaciones de sabores innovadoras.', 6),
('es', 'C2', 'food', 'Me gustaría proporcionar comentarios integrales sobre los estándares de entrega de servicio y la experiencia general de comedor.', 7),
('es', 'C2', 'food', '¿Podríamos organizar un espacio de comedor exclusivo que proporcione privacidad y una atmósfera mejorada para nuestro grupo?', 8),
('es', 'C2', 'food', 'Estoy interesado en experimentar el menú de degustación del chef que muestra toda la gama de capacidades culinarias.', 9),
('es', 'C2', 'food', '¿Cuál es su política con respecto al servicio de bebidas externas, tarifas de corcho y arreglos para ocasiones especiales?', 10),
('es', 'C2', 'food', 'Me gustaría organizar un evento de hospitalidad corporativa en su lugar con requisitos y expectativas específicas.', 11),
('es', 'C2', 'food', 'La presentación, el perfil de sabor y la técnica culinaria demuestran experiencia gastronómica sofisticada.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('es', 'C2', 'accommodation', 'Aseguré una reserva a través de una plataforma agregadora de viajes en línea y necesito verificar los detalles.', 1),
('es', 'C2', 'accommodation', '¿Qué comodidades premium, servicios personalizados e instalaciones exclusivas están disponibles en sus suites ejecutivas?', 2),
('es', 'C2', 'accommodation', 'Me gustaría solicitar alojamientos con requisitos funcionales específicos y consideraciones de accesibilidad.', 3),
('es', 'C2', 'accommodation', '¿Podrían proporcionar información integral sobre su programa de lealtad de huéspedes, estructura de recompensas y beneficios de membresía?', 4),
('es', 'C2', 'accommodation', 'Necesito modificar los parámetros de reserva para acomodar circunstancias cambiantes mientras mantengo términos favorables.', 5),
('es', 'C2', 'accommodation', '¿Cuál es su marco de política con respecto al check-in temprano, check-out tardío y arreglos de alojamiento flexibles?', 6),
('es', 'C2', 'accommodation', 'Me gustaría organizar servicios de conserjería suplementarios y asistencia personalizada durante mi estancia extendida.', 7),
('es', 'C2', 'accommodation', '¿Podrían recomendar comodidades, instalaciones y servicios enfocados en negocios para viajeros corporativos?', 8),
('es', 'C2', 'accommodation', 'Necesito revisar los términos de cancelación, condiciones e implicaciones financieras potenciales en detalle integral.', 9),
('es', 'C2', 'accommodation', '¿Qué instalaciones de conferencias, espacios de reunión y capacidades de eventos tienen disponibles para funciones corporativas?', 10),
('es', 'C2', 'accommodation', 'Me gustaría proporcionar comentarios detallados sobre mi experiencia como huésped y estándares de entrega de servicio.', 11),
('es', 'C2', 'accommodation', 'La entrega de servicio aquí consistentemente supera los puntos de referencia de la industria y demuestra estándares de hospitalidad excepcionales.', 12);

-- =====================================================
-- GERMAN (de) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'A2', 'greetings', 'Guten Morgen! Wie haben Sie geschlafen?', 1),
('de', 'A2', 'greetings', 'Es ist eine Freude, Sie kennenzulernen.', 2),
('de', 'A2', 'greetings', 'Wie geht es Ihnen in letzter Zeit?', 3),
('de', 'A2', 'greetings', 'Mir geht es gut, danke der Nachfrage.', 4),
('de', 'A2', 'greetings', 'Was führt Sie heute hierher?', 5),
('de', 'A2', 'greetings', 'Ich hoffe, wir bleiben in Kontakt.', 6),
('de', 'A2', 'greetings', 'Es war schön, sich mit Ihnen zu unterhalten.', 7),
('de', 'A2', 'greetings', 'Passen Sie auf sich auf und bis bald!', 8),
('de', 'A2', 'greetings', 'Ich freue mich darauf, Sie wiederzusehen.', 9),
('de', 'A2', 'greetings', 'Ich wünsche Ihnen einen wunderbaren Tag!', 10),
('de', 'A2', 'greetings', 'Vielen Dank für Ihre Zeit.', 11),
('de', 'A2', 'greetings', 'Ich schätze es, dass Sie sich Zeit für dieses Treffen genommen haben.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'A2', 'ordering', 'Könnte ich bitte die Speisekarte sehen?', 1),
('de', 'A2', 'ordering', 'Was würden Sie empfehlen?', 2),
('de', 'A2', 'ordering', 'Ich würde gerne etwas Lokales probieren.', 3),
('de', 'A2', 'ordering', 'Gibt es einen Rabatt für Studenten?', 4),
('de', 'A2', 'ordering', 'Könnte ich bitte eine Quittung bekommen?', 5),
('de', 'A2', 'ordering', 'Bieten Sie Geschenkverpackung an?', 6),
('de', 'A2', 'ordering', 'Ich suche etwas Bestimmtes.', 7),
('de', 'A2', 'ordering', 'Könnten Sie mir helfen, diesen Artikel zu finden?', 8),
('de', 'A2', 'ordering', 'Wie ist Ihre Rückgabepolitik?', 9),
('de', 'A2', 'ordering', 'Ich würde dies gerne umtauschen, bitte.', 10),
('de', 'A2', 'ordering', 'Ist dies in anderen Farben erhältlich?', 11),
('de', 'A2', 'ordering', 'Kann ich in Raten zahlen?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'A2', 'directions', 'Könnten Sie mir sagen, wie ich zum Museum komme?', 1),
('de', 'A2', 'directions', 'Ist es zu Fuß erreichbar?', 2),
('de', 'A2', 'directions', 'Wie lange dauert die Fahrt?', 3),
('de', 'A2', 'directions', 'Von welchem Gleis fährt der Zug ab?', 4),
('de', 'A2', 'directions', 'Muss ich umsteigen?', 5),
('de', 'A2', 'directions', 'Wo kann ich ein Ticket kaufen?', 6),
('de', 'A2', 'directions', 'Gibt es eine direkte Route?', 7),
('de', 'A2', 'directions', 'Könnten Sie mir die richtige Richtung zeigen?', 8),
('de', 'A2', 'directions', 'Ich glaube, ich habe mich verlaufen. Können Sie helfen?', 9),
('de', 'A2', 'directions', 'Was ist der beste Weg dorthin?', 10),
('de', 'A2', 'directions', 'Gibt es in der Nähe Parkplätze?', 11),
('de', 'A2', 'directions', 'Wie viel kostet ein Taxi zum Flughafen?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'A2', 'food', 'Könnten wir einen Tisch am Fenster haben?', 1),
('de', 'A2', 'food', 'Ich würde gerne einen Tisch für zwei Personen reservieren.', 2),
('de', 'A2', 'food', 'Was sind die Tagesgerichte?', 3),
('de', 'A2', 'food', 'Ich habe eine Lebensmittelallergie. Ist dieses Gericht sicher?', 4),
('de', 'A2', 'food', 'Könnte ich dies ohne Zwiebeln haben?', 5),
('de', 'A2', 'food', 'Das Essen hier ist ausgezeichnet!', 6),
('de', 'A2', 'food', 'Könnte ich bitte die Rechnung bekommen?', 7),
('de', 'A2', 'food', 'Ist das Trinkgeld in der Rechnung enthalten?', 8),
('de', 'A2', 'food', 'Ich würde gerne ein Dessert bestellen.', 9),
('de', 'A2', 'food', 'Könnte ich ein Glas Wasser haben?', 10),
('de', 'A2', 'food', 'Was empfehlen Sie für einen Vegetarier?', 11),
('de', 'A2', 'food', 'Der Service hier ist sehr gut.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'A2', 'accommodation', 'Ich habe online eine Reservierung vorgenommen.', 1),
('de', 'A2', 'accommodation', 'Um wie viel Uhr beginnt das Frühstück?', 2),
('de', 'A2', 'accommodation', 'Könnte ich ein Zimmer mit Aussicht haben?', 3),
('de', 'A2', 'accommodation', 'Gibt es ein Fitnessstudio oder einen Pool?', 4),
('de', 'A2', 'accommodation', 'Das Zimmer ist sehr komfortabel.', 5),
('de', 'A2', 'accommodation', 'Könnte ich bitte zusätzliche Kissen bekommen?', 6),
('de', 'A2', 'accommodation', 'Ich würde gerne meinen Aufenthalt verlängern.', 7),
('de', 'A2', 'accommodation', 'Wie ist Ihre Stornierungsrichtlinie?', 8),
('de', 'A2', 'accommodation', 'Könnten Sie Restaurants in der Nähe empfehlen?', 9),
('de', 'A2', 'accommodation', 'Gibt es einen Shuttle zum Flughafen?', 10),
('de', 'A2', 'accommodation', 'Ich muss morgen früh auschecken.', 11),
('de', 'A2', 'accommodation', 'Könnte ich mein Gepäck nach dem Check-out aufbewahren?', 12);

-- =====================================================
-- GERMAN (de) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B1', 'greetings', 'Es ist eine Weile her, seit wir uns das letzte Mal gesehen haben.', 1),
('de', 'B1', 'greetings', 'Ich würde Sie gerne meinem Kollegen vorstellen.', 2),
('de', 'B1', 'greetings', 'Wie war Ihr Tag bisher?', 3),
('de', 'B1', 'greetings', 'Ich hoffe, alles läuft gut für Sie.', 4),
('de', 'B1', 'greetings', 'Es ist wunderbar, Sie wiederzusehen.', 5),
('de', 'B1', 'greetings', 'Ich wollte mich schon länger mit Ihnen in Verbindung setzen.', 6),
('de', 'B1', 'greetings', 'Lassen Sie uns regelmäßiger in Kontakt bleiben.', 7),
('de', 'B1', 'greetings', 'Ich schätze es, dass Sie sich Zeit für dieses Treffen genommen haben.', 8),
('de', 'B1', 'greetings', 'Vielen Dank, dass Sie so kurzfristig gekommen sind.', 9),
('de', 'B1', 'greetings', 'Ich freue mich auf unsere zukünftige Zusammenarbeit.', 10),
('de', 'B1', 'greetings', 'Es war eine Freude, Zeit mit Ihnen zu verbringen.', 11),
('de', 'B1', 'greetings', 'Ich hoffe, wir können uns bald wieder treffen.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B1', 'ordering', 'Ich bin daran interessiert, diesen Artikel zu kaufen.', 1),
('de', 'B1', 'ordering', 'Könnten Sie mir mehr Informationen über dieses Produkt geben?', 2),
('de', 'B1', 'ordering', 'Wie lange ist die Garantiezeit dafür?', 3),
('de', 'B1', 'ordering', 'Ich würde gerne verschiedene Optionen vergleichen.', 4),
('de', 'B1', 'ordering', 'Bieten Sie Werbeaktionen oder Rabatte an?', 5),
('de', 'B1', 'ordering', 'Könnte ich dies in einer anderen Größe sehen?', 6),
('de', 'B1', 'ordering', 'Ich suche etwas Preiswerteres.', 7),
('de', 'B1', 'ordering', 'Welche Zahlungsmethoden akzeptieren Sie?', 8),
('de', 'B1', 'ordering', 'Könnten Sie diesen Artikel bis morgen für mich zurücklegen?', 9),
('de', 'B1', 'ordering', 'Ich würde diesen Kauf gerne zurückgeben.', 10),
('de', 'B1', 'ordering', 'Wie ist Ihre Umtauschrichtlinie?', 11),
('de', 'B1', 'ordering', 'Könnte ich eine Geschenkquittung dafür bekommen?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B1', 'directions', 'Ich muss die schnellste Route zum Stadtzentrum finden.', 1),
('de', 'B1', 'directions', 'Könnten Sie mir den besten Weg dorthin erklären?', 2),
('de', 'B1', 'directions', 'Gibt es öffentliche Verkehrsmittel?', 3),
('de', 'B1', 'directions', 'Wie viel würde ein Taxi ungefähr kosten?', 4),
('de', 'B1', 'directions', 'Ich bevorzuge die U-Bahn.', 5),
('de', 'B1', 'directions', 'Könnten Sie mir auf der Karte zeigen, wo wir sind?', 6),
('de', 'B1', 'directions', 'Ich bin mit dieser Gegend nicht vertraut.', 7),
('de', 'B1', 'directions', 'Auf welche Sehenswürdigkeiten sollte ich achten?', 8),
('de', 'B1', 'directions', 'Ist es zu dieser Zeit sicher, dorthin zu laufen?', 9),
('de', 'B1', 'directions', 'Könnten Sie einen zuverlässigen Taxiservice empfehlen?', 10),
('de', 'B1', 'directions', 'Ich muss einen Flug erwischen, daher ist Zeit wichtig.', 11),
('de', 'B1', 'directions', 'Gibt es Straßensperrungen, die ich kennen sollte?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B1', 'food', 'Ich würde gerne für dieses Wochenende eine Abendreservierung vornehmen.', 1),
('de', 'B1', 'food', 'Haben Sie vegetarische Optionen auf der Speisekarte?', 2),
('de', 'B1', 'food', 'Ich habe diätetische Einschränkungen. Können Sie diese berücksichtigen?', 3),
('de', 'B1', 'food', 'Was ist die Empfehlung des Kochs für heute?', 4),
('de', 'B1', 'food', 'Könnte ich dieses Gericht ohne Milchprodukte zubereitet bekommen?', 5),
('de', 'B1', 'food', 'Die Präsentation des Essens ist beeindruckend.', 6),
('de', 'B1', 'food', 'Ich würde gerne dem Koch für dieses Essen Komplimente machen.', 7),
('de', 'B1', 'food', 'Könnten wir bitte getrennt zahlen?', 8),
('de', 'B1', 'food', 'Ist eine Servicegebühr enthalten?', 9),
('de', 'B1', 'food', 'Ich würde gerne eine Flasche Wein bestellen.', 10),
('de', 'B1', 'food', 'Könnten Sie ein gutes lokales Restaurant empfehlen?', 11),
('de', 'B1', 'food', 'Die Atmosphäre hier ist sehr angenehm.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B1', 'accommodation', 'Ich habe ein Zimmer über Ihre Website gebucht.', 1),
('de', 'B1', 'accommodation', 'Welche Annehmlichkeiten sind im Zimmer enthalten?', 2),
('de', 'B1', 'accommodation', 'Ich würde ein Zimmer in einem höheren Stockwerk bevorzugen.', 3),
('de', 'B1', 'accommodation', 'Gibt es einen Zimmerservice?', 4),
('de', 'B1', 'accommodation', 'Könnte ich einen späten Check-out haben, bitte?', 5),
('de', 'B1', 'accommodation', 'Ich muss meine Reservierung stornieren.', 6),
('de', 'B1', 'accommodation', 'Wie ist Ihre Richtlinie bezüglich Haustieren?', 7),
('de', 'B1', 'accommodation', 'Könnten Sie einen Flughafentransfer arrangieren?', 8),
('de', 'B1', 'accommodation', 'Ich würde gerne meine Reservierung um eine Nacht verlängern.', 9),
('de', 'B1', 'accommodation', 'Gibt es Sehenswürdigkeiten in der Nähe?', 10),
('de', 'B1', 'accommodation', 'Könnten Sie eine Karte der Umgebung bereitstellen?', 11),
('de', 'B1', 'accommodation', 'Ich bin sehr zufrieden mit dem Service hier.', 12);

-- =====================================================
-- GERMAN (de) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B2', 'greetings', 'Ich habe mich auf dieses Treffen gefreut.', 1),
('de', 'B2', 'greetings', 'Es ist eine Ehre, Ihre Bekanntschaft zu machen.', 2),
('de', 'B2', 'greetings', 'Ich hoffe, wir können eine produktive Beziehung aufbauen.', 3),
('de', 'B2', 'greetings', 'Vielen Dank, dass Sie sich Zeit aus Ihrem vollen Terminkalender genommen haben.', 4),
('de', 'B2', 'greetings', 'Ich schätze die Gelegenheit, mich mit Ihnen zu verbinden.', 5),
('de', 'B2', 'greetings', 'Lassen Sie uns von nun an regelmäßig kommunizieren.', 6),
('de', 'B2', 'greetings', 'Ich schätze unsere berufliche Beziehung.', 7),
('de', 'B2', 'greetings', 'Es war eine Freude, diese Angelegenheit mit Ihnen zu besprechen.', 8),
('de', 'B2', 'greetings', 'Ich freue mich auf unsere fortgesetzte Zusammenarbeit.', 9),
('de', 'B2', 'greetings', 'Vielen Dank für Ihre Gastfreundschaft und herzliche Begrüßung.', 10),
('de', 'B2', 'greetings', 'Ich hoffe, wir können uns unter besseren Umständen wieder treffen.', 11),
('de', 'B2', 'greetings', 'Ich bin dankbar für Ihre Zeit und Überlegungen.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B2', 'ordering', 'Ich erwäge einen bedeutenden Kauf zu tätigen.', 1),
('de', 'B2', 'ordering', 'Könnten Sie detaillierte Spezifikationen für dieses Produkt bereitstellen?', 2),
('de', 'B2', 'ordering', 'Ich würde gerne die Bedingungen dieser Transaktion verhandeln.', 3),
('de', 'B2', 'ordering', 'Welche Finanzierungsoptionen stehen zur Verfügung?', 4),
('de', 'B2', 'ordering', 'Ich muss mich mit jemandem beraten, bevor ich eine Entscheidung treffe.', 5),
('de', 'B2', 'ordering', 'Könnten Sie einen besseren Preis für einen Mengenkauf anbieten?', 6),
('de', 'B2', 'ordering', 'Ich interessiere mich für Ihr Premium-Servicepaket.', 7),
('de', 'B2', 'ordering', 'Wie ist Ihre Richtlinie bezüglich Produktmängeln?', 8),
('de', 'B2', 'ordering', 'Ich würde gerne einen Zahlungsplan vereinbaren.', 9),
('de', 'B2', 'ordering', 'Könnten Sie eine detaillierte Rechnung für diesen Kauf erstellen?', 10),
('de', 'B2', 'ordering', 'Ich muss diesen Artikel aufgrund eines Herstellungsfehlers zurückgeben.', 11),
('de', 'B2', 'ordering', 'Wie ist Ihre Kundenzufriedenheitsgarantie?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B2', 'directions', 'Ich benötige detaillierte Wegbeschreibungen, um mein Ziel effizient zu erreichen.', 1),
('de', 'B2', 'directions', 'Könnten Sie die malerischste Route vorschlagen?', 2),
('de', 'B2', 'directions', 'Ich mache mir Sorgen über die Verkehrsbedingungen zu dieser Zeit.', 3),
('de', 'B2', 'directions', 'Was ist das zuverlässigste Verkehrsmittel?', 4),
('de', 'B2', 'directions', 'Ich bevorzuge es, Mautstraßen wenn möglich zu vermeiden.', 5),
('de', 'B2', 'directions', 'Könnten Sie eine Navigations-App für diese Gegend empfehlen?', 6),
('de', 'B2', 'directions', 'Ich muss mehrere Stopps auf meiner Reise koordinieren.', 7),
('de', 'B2', 'directions', 'Wie ist die geschätzte Reisezeit unter Berücksichtigung der aktuellen Bedingungen?', 8),
('de', 'B2', 'directions', 'Ich würde gerne Informationen über alternative Routen erhalten.', 9),
('de', 'B2', 'directions', 'Könnten Sie Informationen über Parkeinrichtungen bereitstellen?', 10),
('de', 'B2', 'directions', 'Ich muss Transport für eine Gruppe arrangieren.', 11),
('de', 'B2', 'directions', 'Welche Sicherheitsüberlegungen gibt es für diese Route?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B2', 'food', 'Ich würde gerne eine Reservierung für einen besonderen Anlass vornehmen.', 1),
('de', 'B2', 'food', 'Könnten Sie eine Gruppe von acht Personen unterbringen?', 2),
('de', 'B2', 'food', 'Ich habe spezifische diätetische Anforderungen, die berücksichtigt werden müssen.', 3),
('de', 'B2', 'food', 'Wie ist der Ansatz des Restaurants zur nachhaltigen Beschaffung?', 4),
('de', 'B2', 'food', 'Ich würde gerne die Weinpaarungsoptionen besprechen.', 5),
('de', 'B2', 'food', 'Das kulinarische Erlebnis hier ist außergewöhnlich.', 6),
('de', 'B2', 'food', 'Ich würde gerne Feedback zur Servicequalität geben.', 7),
('de', 'B2', 'food', 'Könnten wir einen privaten Essbereich arrangieren?', 8),
('de', 'B2', 'food', 'Ich interessiere mich für das Degustationsmenü des Kochs.', 9),
('de', 'B2', 'food', 'Wie ist Ihre Richtlinie bezüglich mitgebrachter Getränke?', 10),
('de', 'B2', 'food', 'Ich würde gerne ein Firmenessen hier organisieren.', 11),
('de', 'B2', 'food', 'Die Präsentation und Geschmackskombination ist hervorragend.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'B2', 'accommodation', 'Ich habe eine Reservierung über eine Drittanbieter-Buchungsplattform vorgenommen.', 1),
('de', 'B2', 'accommodation', 'Welche Premium-Annehmlichkeiten sind in Ihren Suiten verfügbar?', 2),
('de', 'B2', 'accommodation', 'Ich würde gerne ein Zimmer mit spezifischen Merkmalen anfragen.', 3),
('de', 'B2', 'accommodation', 'Könnten Sie Informationen über Ihr Treueprogramm bereitstellen?', 4),
('de', 'B2', 'accommodation', 'Ich muss meine Reservierungsdetails ändern.', 5),
('de', 'B2', 'accommodation', 'Wie ist Ihre Richtlinie bezüglich frühem Check-in?', 6),
('de', 'B2', 'accommodation', 'Ich würde gerne zusätzliche Dienstleistungen während meines Aufenthalts arrangieren.', 7),
('de', 'B2', 'accommodation', 'Könnten Sie Aktivitäten für Geschäftsreisende empfehlen?', 8),
('de', 'B2', 'accommodation', 'Ich muss die Stornierungsbedingungen im Detail besprechen.', 9),
('de', 'B2', 'accommodation', 'Welche Konferenzeinrichtungen haben Sie verfügbar?', 10),
('de', 'B2', 'accommodation', 'Ich würde gerne Feedback zu meiner Erfahrung geben.', 11),
('de', 'B2', 'accommodation', 'Das Serviceniveau hier übertrifft meine Erwartungen.', 12);

-- =====================================================
-- GERMAN (de) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C1', 'greetings', 'Ich habe diese Gelegenheit, mich mit Ihnen zu verbinden, erwartet.', 1),
('de', 'C1', 'greetings', 'Es ist ein Privileg, solch angesehenen Personen vorgestellt zu werden.', 2),
('de', 'C1', 'greetings', 'Ich hoffe, wir können eine für beide Seiten vorteilhafte berufliche Beziehung fördern.', 3),
('de', 'C1', 'greetings', 'Vielen Dank, dass Sie dieses Treffen trotz Ihrer anspruchsvollen Terminplanung ermöglicht haben.', 4),
('de', 'C1', 'greetings', 'Ich schätze die Gelegenheit, an einem bedeutungsvollen Dialog mit Ihnen teilzunehmen.', 5),
('de', 'C1', 'greetings', 'Lassen Sie uns einen Rahmen für fortlaufende Kommunikation und Zusammenarbeit etablieren.', 6),
('de', 'C1', 'greetings', 'Ich schätze die Tiefe und Qualität unserer beruflichen Interaktionen.', 7),
('de', 'C1', 'greetings', 'Es war intellektuell anregend, Perspektiven mit Ihnen auszutauschen.', 8),
('de', 'C1', 'greetings', 'Ich freue mich darauf, potenzielle Synergien zwischen unseren Organisationen zu erkunden.', 9),
('de', 'C1', 'greetings', 'Vielen Dank für Ihre großzügige Gastfreundschaft und durchdachte Arrangements.', 10),
('de', 'C1', 'greetings', 'Ich hoffe, wir können uns unter günstigeren Umständen wieder treffen.', 11),
('de', 'C1', 'greetings', 'Ich bin zutiefst dankbar für Ihre Zeit und professionellen Einblicke.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C1', 'ordering', 'Ich bewerte diesen Kauf als Teil einer umfassenderen Beschaffungsstrategie.', 1),
('de', 'C1', 'ordering', 'Könnten Sie umfassende technische Dokumentation für dieses Produkt bereitstellen?', 2),
('de', 'C1', 'ordering', 'Ich würde gerne Verhandlungen bezüglich der kommerziellen Bedingungen führen.', 3),
('de', 'C1', 'ordering', 'Welche strukturierten Finanzierungsvereinbarungen haben Sie verfügbar?', 4),
('de', 'C1', 'ordering', 'Ich muss eine Due-Diligence-Prüfung durchführen, bevor ich diese Transaktion abschließe.', 5),
('de', 'C1', 'ordering', 'Könnten Sie eine Mengenrabattstruktur für Unternehmenskunden vorschlagen?', 6),
('de', 'C1', 'ordering', 'Ich interessiere mich für Ihr umfassendes Service- und Supportpaket.', 7),
('de', 'C1', 'ordering', 'Wie ist Ihr Qualitätssicherungs- und Garantierahmen?', 8),
('de', 'C1', 'ordering', 'Ich würde gerne eine flexible Zahlungsvereinbarung etablieren.', 9),
('de', 'C1', 'ordering', 'Könnten Sie eine detaillierte Handelsrechnung mit aufgeschlüsselter Aufstellung erstellen?', 10),
('de', 'C1', 'ordering', 'Ich muss einen Rückgabeprozess aufgrund der Nichteinhaltung der Spezifikationen einleiten.', 11),
('de', 'C1', 'ordering', 'Wie ist Ihr Kundenzufriedenheits- und Streitbeilegungsmechanismus?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C1', 'directions', 'Ich benötige umfassende Navigationsanleitung, um meine Reiseroute zu optimieren.', 1),
('de', 'C1', 'directions', 'Könnten Sie Routen empfehlen, die sowohl Effizienz als auch landschaftlichen Wert bieten?', 2),
('de', 'C1', 'directions', 'Ich überwache Verkehrsmuster, um optimale Abfahrtszeiten zu bestimmen.', 3),
('de', 'C1', 'directions', 'Welche Transportoptionen bieten das beste Zuverlässigkeits-Kosten-Verhältnis?', 4),
('de', 'C1', 'directions', 'Ich bevorzuge es, Mautkosten zu minimieren, während ich eine angemessene Reisezeit beibehalte.', 5),
('de', 'C1', 'directions', 'Könnten Sie Navigationslösungen empfehlen, die Echtzeit-Verkehrsdaten integrieren?', 6),
('de', 'C1', 'directions', 'Ich muss eine mehrstufige Route mit zeitkritischen Terminen koordinieren.', 7),
('de', 'C1', 'directions', 'Wie ist die projizierte Reisedauer unter Berücksichtigung der aktuellen Verkehrsbedingungen?', 8),
('de', 'C1', 'directions', 'Ich würde Informationen über alternative Routingstrategien schätzen.', 9),
('de', 'C1', 'directions', 'Könnten Sie Details über Parkinfrastruktur und Verfügbarkeit bereitstellen?', 10),
('de', 'C1', 'directions', 'Ich muss Transportlogistik für eine Unternehmensdelegation arrangieren.', 11),
('de', 'C1', 'directions', 'Welche Sicherheits- und Schutzüberlegungen sollten die Routenauswahl beeinflussen?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C1', 'food', 'Ich würde gerne eine Reservierung für ein bedeutendes Feierereignis arrangieren.', 1),
('de', 'C1', 'food', 'Könnten Sie eine beträchtliche Gruppe unterbringen und dabei die Servicequalität aufrechterhalten?', 2),
('de', 'C1', 'food', 'Ich habe komplexe diätetische Anforderungen, die sorgfältige Berücksichtigung erfordern.', 3),
('de', 'C1', 'food', 'Wie ist das Engagement des Unternehmens für nachhaltige und ethische Beschaffungspraktiken?', 4),
('de', 'C1', 'food', 'Ich würde gerne mit Ihrem Sommelier bezüglich Weinpaarungen konsultieren.', 5),
('de', 'C1', 'food', 'Das gastronomische Erlebnis hier demonstriert außergewöhnliche kulinarische Kunstfertigkeit.', 6),
('de', 'C1', 'food', 'Ich würde gerne umfassendes Feedback zu Servicestandards geben.', 7),
('de', 'C1', 'food', 'Könnten wir einen exklusiven Essbereich für unsere Gruppe arrangieren?', 8),
('de', 'C1', 'food', 'Ich interessiere mich dafür, das Degustationsmenü des Kochs zu erleben.', 9),
('de', 'C1', 'food', 'Wie ist Ihre Richtlinie bezüglich externer Getränkeservice und Korkgeld?', 10),
('de', 'C1', 'food', 'Ich würde gerne ein Unternehmensgastronomie-Event in Ihrem Veranstaltungsort organisieren.', 11),
('de', 'C1', 'food', 'Die Präsentation und Geschmacksprofil demonstrieren raffinierte kulinarische Technik.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C1', 'accommodation', 'Ich habe eine Reservierung über eine Online-Reiseaggregator-Plattform gesichert.', 1),
('de', 'C1', 'accommodation', 'Welche Premium-Annehmlichkeiten und Dienstleistungen sind in Ihren Executive-Suites verfügbar?', 2),
('de', 'C1', 'accommodation', 'Ich würde gerne Unterkünfte mit spezifischen funktionalen Anforderungen anfragen.', 3),
('de', 'C1', 'accommodation', 'Könnten Sie Informationen über Ihr Gästetreue- und Belohnungsprogramm bereitstellen?', 4),
('de', 'C1', 'accommodation', 'Ich muss Reservierungsparameter ändern, um geänderte Umstände zu berücksichtigen.', 5),
('de', 'C1', 'accommodation', 'Wie ist Ihr Richtlinienrahmen bezüglich frühem Check-in und spätem Check-out?', 6),
('de', 'C1', 'accommodation', 'Ich würde gerne zusätzliche Concierge-Dienstleistungen während meines Aufenthalts arrangieren.', 7),
('de', 'C1', 'accommodation', 'Könnten Sie geschäftsorientierte Annehmlichkeiten und Einrichtungen empfehlen?', 8),
('de', 'C1', 'accommodation', 'Ich muss Stornierungsbedingungen und -bestimmungen im Detail überprüfen.', 9),
('de', 'C1', 'accommodation', 'Welche Konferenz- und Tagungseinrichtungen haben Sie für Unternehmensveranstaltungen verfügbar?', 10),
('de', 'C1', 'accommodation', 'Ich würde gerne detailliertes Feedback zu meiner Gästerfahrung geben.', 11),
('de', 'C1', 'accommodation', 'Die Servicebereitstellung hier übertrifft konsistent Branchenbenchmarks.', 12);

-- =====================================================
-- GERMAN (de) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C2', 'greetings', 'Ich habe diese Gelegenheit, eine bedeutungsvolle berufliche Verbindung herzustellen, mit großer Vorfreude erwartet.', 1),
('de', 'C2', 'greetings', 'Es ist in der Tat eine Ehre, solch erfolgreichen und angesehenen Fachleuten vorgestellt zu werden.', 2),
('de', 'C2', 'greetings', 'Ich hoffe, wir können eine für beide Seiten vorteilhafte und dauerhafte berufliche Beziehung kultivieren.', 3),
('de', 'C2', 'greetings', 'Vielen Dank, dass Sie dieses Treffen trotz Ihrer äußerst anspruchsvollen Terminplanung großzügig ermöglicht haben.', 4),
('de', 'C2', 'greetings', 'Ich schätze zutiefst die Gelegenheit, an einem substanziellen und intellektuell anregenden Dialog teilzunehmen.', 5),
('de', 'C2', 'greetings', 'Lassen Sie uns einen robusten Rahmen für nachhaltige Kommunikation und strategische Zusammenarbeit etablieren.', 6),
('de', 'C2', 'greetings', 'Ich schätze die Raffinesse und Tiefe unserer beruflichen Interaktionen sehr.', 7),
('de', 'C2', 'greetings', 'Es war intellektuell bereichernd, nuancierte Perspektiven und Einblicke mit Ihnen auszutauschen.', 8),
('de', 'C2', 'greetings', 'Ich freue mich darauf, potenzielle Synergien und Kooperationsmöglichkeiten zwischen unseren Organisationen zu erkunden.', 9),
('de', 'C2', 'greetings', 'Vielen Dank für Ihre außergewöhnliche Gastfreundschaft und sorgfältig durchdachte Arrangements.', 10),
('de', 'C2', 'greetings', 'Ich hoffe, wir können uns unter Umständen wieder treffen, die noch förderlicher für produktiven Diskurs sind.', 11),
('de', 'C2', 'greetings', 'Ich bin zutiefst dankbar für Ihre wertvolle Zeit und aufschlussreiche berufliche Beiträge.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C2', 'ordering', 'Ich führe eine umfassende Bewertung dieses Kaufs im Kontext unserer breiteren Beschaffungsstrategie durch.', 1),
('de', 'C2', 'ordering', 'Könnten Sie erschöpfende technische Dokumentation und Konformitätszertifizierungen für dieses Produkt bereitstellen?', 2),
('de', 'C2', 'ordering', 'Ich würde gerne anspruchsvolle Verhandlungen bezüglich der kommerziellen und vertraglichen Bedingungen führen.', 3),
('de', 'C2', 'ordering', 'Welche strukturierten Finanzierungsvereinbarungen und Zahlungsbedingungen haben Sie für Unternehmenskunden verfügbar?', 4),
('de', 'C2', 'ordering', 'Ich muss eine gründliche Due-Diligence-Prüfung und Risikobewertung durchführen, bevor ich diese Transaktion abschließe.', 5),
('de', 'C2', 'ordering', 'Könnten Sie eine umfassende Mengenrabattstruktur mit gestufter Preisgestaltung für großangelegte Beschaffungen vorschlagen?', 6),
('de', 'C2', 'ordering', 'Ich interessiere mich für Ihr Premium-Servicepaket, das umfassenden Support und Wartung beinhaltet.', 7),
('de', 'C2', 'ordering', 'Wie ist Ihr Qualitätssicherungsrahmen, Garantieabdeckung und Nachverkaufs-Support-Infrastruktur?', 8),
('de', 'C2', 'ordering', 'Ich würde gerne eine flexible Zahlungsvereinbarung etablieren, die unsere Finanzplanungszyklen berücksichtigt.', 9),
('de', 'C2', 'ordering', 'Könnten Sie eine detaillierte Handelsrechnung mit umfassender aufgeschlüsselter Aufstellung und Steuerdokumentation erstellen?', 10),
('de', 'C2', 'ordering', 'Ich muss einen formellen Rückgabeprozess aufgrund der Nichteinhaltung der spezifizierten technischen Anforderungen einleiten.', 11),
('de', 'C2', 'ordering', 'Wie ist Ihr umfassender Kundenzufriedenheitsgarantie- und Streitbeilegungsmechanismus?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C2', 'directions', 'Ich benötige umfassende Navigationsanleitung, um meine Reiseroute zu optimieren und gleichzeitig Transitzeit und Kosten zu minimieren.', 1),
('de', 'C2', 'directions', 'Könnten Sie Routen empfehlen, die ein optimales Gleichgewicht zwischen Effizienz, landschaftlichem Wert und Sicherheitsüberlegungen bieten?', 2),
('de', 'C2', 'directions', 'Ich überwache Echtzeit-Verkehrsmuster und historische Daten, um das günstigste Abfahrtsfenster zu bestimmen.', 3),
('de', 'C2', 'directions', 'Welche Transportmodalitäten bieten das günstigste Zuverlässigkeits-Kosten-Verhältnis für diese spezielle Reise?', 4),
('de', 'C2', 'directions', 'Ich bevorzuge es, Mautkosten zu minimieren, während ich eine angemessene Reisedauer und Routeneffizienz beibehalte.', 5),
('de', 'C2', 'directions', 'Könnten Sie fortschrittliche Navigationslösungen empfehlen, die Echtzeit-Verkehrsdaten und prädiktive Analysen integrieren?', 6),
('de', 'C2', 'directions', 'Ich muss eine komplexe mehrstufige Route mit zeitkritischen Terminen und logistischen Einschränkungen koordinieren.', 7),
('de', 'C2', 'directions', 'Wie ist die projizierte Reisedauer unter Berücksichtigung der aktuellen Verkehrsbedingungen, potenzieller Verzögerungen und Routenoptimierung?', 8),
('de', 'C2', 'directions', 'Ich würde umfassende Informationen über alternative Routingstrategien und Notfallplanung schätzen.', 9),
('de', 'C2', 'directions', 'Könnten Sie detaillierte Informationen über Parkinfrastruktur, Verfügbarkeit, Preisgestaltung und Reservierungsoptionen bereitstellen?', 10),
('de', 'C2', 'directions', 'Ich muss anspruchsvolle Transportlogistik für eine Unternehmensdelegation mit spezifischen Anforderungen arrangieren.', 11),
('de', 'C2', 'directions', 'Welche Sicherheits-, Schutz- und Risikominderungsüberlegungen sollten unsere Routenauswahlstrategie beeinflussen?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C2', 'food', 'Ich würde gerne eine Reservierung für ein bedeutendes Feierereignis mit spezifischen Anforderungen und Erwartungen arrangieren.', 1),
('de', 'C2', 'food', 'Könnten Sie eine beträchtliche Gruppe unterbringen und dabei außergewöhnliche Servicequalität und Aufmerksamkeit für Details aufrechterhalten?', 2),
('de', 'C2', 'food', 'Ich habe komplexe diätetische Anforderungen und Präferenzen, die sorgfältige Berücksichtigung und maßgeschneiderte Zubereitung erfordern.', 3),
('de', 'C2', 'food', 'Wie ist das Engagement des Unternehmens für nachhaltige Beschaffung, ethische Praktiken und Umweltverantwortung?', 4),
('de', 'C2', 'food', 'Ich würde gerne mit Ihrem Sommelier bezüglich raffinierter Weinpaarungen konsultieren, die das kulinarische Erlebnis ergänzen.', 5),
('de', 'C2', 'food', 'Das gastronomische Erlebnis hier demonstriert außergewöhnliche kulinarische Kunstfertigkeit und innovative Geschmackskombinationen.', 6),
('de', 'C2', 'food', 'Ich würde gerne umfassendes Feedback zu Servicestandards und Gesamtdining-Erfahrung geben.', 7),
('de', 'C2', 'food', 'Könnten wir einen exklusiven Essbereich arrangieren, der Privatsphäre und eine verbesserte Atmosphäre für unsere Gruppe bietet?', 8),
('de', 'C2', 'food', 'Ich interessiere mich dafür, das Degustationsmenü des Kochs zu erleben, das die gesamte Bandbreite kulinarischer Fähigkeiten zeigt.', 9),
('de', 'C2', 'food', 'Wie ist Ihre Richtlinie bezüglich externem Getränkeservice, Korkgeld und Arrangements für besondere Anlässe?', 10),
('de', 'C2', 'food', 'Ich würde gerne ein Unternehmensgastronomie-Event in Ihrem Veranstaltungsort mit spezifischen Anforderungen und Erwartungen organisieren.', 11),
('de', 'C2', 'food', 'Die Präsentation, das Geschmacksprofil und die kulinarische Technik demonstrieren raffinierte gastronomische Expertise.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('de', 'C2', 'accommodation', 'Ich habe eine Reservierung über eine Online-Reiseaggregator-Plattform gesichert und muss die Details überprüfen.', 1),
('de', 'C2', 'accommodation', 'Welche Premium-Annehmlichkeiten, personalisierten Dienstleistungen und exklusiven Einrichtungen sind in Ihren Executive-Suites verfügbar?', 2),
('de', 'C2', 'accommodation', 'Ich würde gerne Unterkünfte mit spezifischen funktionalen Anforderungen und Barrierefreiheitsüberlegungen anfragen.', 3),
('de', 'C2', 'accommodation', 'Könnten Sie umfassende Informationen über Ihr Gästetreueprogramm, Belohnungsstruktur und Mitgliedschaftsvorteile bereitstellen?', 4),
('de', 'C2', 'accommodation', 'Ich muss Reservierungsparameter ändern, um geänderte Umstände zu berücksichtigen und dabei günstige Bedingungen beizubehalten.', 5),
('de', 'C2', 'accommodation', 'Wie ist Ihr Richtlinienrahmen bezüglich frühem Check-in, spätem Check-out und flexiblen Unterkunftsarrangements?', 6),
('de', 'C2', 'accommodation', 'Ich würde gerne zusätzliche Concierge-Dienstleistungen und personalisierte Unterstützung während meines verlängerten Aufenthalts arrangieren.', 7),
('de', 'C2', 'accommodation', 'Könnten Sie geschäftsorientierte Annehmlichkeiten, Einrichtungen und Dienstleistungen für Geschäftsreisende empfehlen?', 8),
('de', 'C2', 'accommodation', 'Ich muss Stornierungsbedingungen, Bestimmungen und potenzielle finanzielle Auswirkungen in umfassendem Detail überprüfen.', 9),
('de', 'C2', 'accommodation', 'Welche Konferenzeinrichtungen, Tagungsräume und Eventkapazitäten haben Sie für Unternehmensfunktionen verfügbar?', 10),
('de', 'C2', 'accommodation', 'Ich würde gerne detailliertes Feedback zu meiner Gästerfahrung und Servicestandards geben.', 11),
('de', 'C2', 'accommodation', 'Die Servicebereitstellung hier übertrifft konsistent Branchenbenchmarks und demonstriert außergewöhnliche Gastfreundschaftsstandards.', 12);

-- =====================================================
-- FRENCH (fr) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'A2', 'greetings', 'Bonjour! Comment avez-vous dormi?', 1),
('fr', 'A2', 'greetings', 'C''est un plaisir de vous rencontrer.', 2),
('fr', 'A2', 'greetings', 'Comment allez-vous ces derniers temps?', 3),
('fr', 'A2', 'greetings', 'Je vais bien, merci de demander.', 4),
('fr', 'A2', 'greetings', 'Qu''est-ce qui vous amène ici aujourd''hui?', 5),
('fr', 'A2', 'greetings', 'J''espère que nous pourrons rester en contact.', 6),
('fr', 'A2', 'greetings', 'C''était agréable de prendre de vos nouvelles.', 7),
('fr', 'A2', 'greetings', 'Prenez soin de vous et à bientôt!', 8),
('fr', 'A2', 'greetings', 'J''ai hâte de vous revoir.', 9),
('fr', 'A2', 'greetings', 'Je vous souhaite une merveilleuse journée!', 10),
('fr', 'A2', 'greetings', 'Merci pour votre temps.', 11),
('fr', 'A2', 'greetings', 'J''apprécie que vous ayez pris le temps de cette réunion.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'A2', 'ordering', 'Pourrais-je voir le menu, s''il vous plaît?', 1),
('fr', 'A2', 'ordering', 'Que recommanderiez-vous?', 2),
('fr', 'A2', 'ordering', 'J''aimerais essayer quelque chose de local.', 3),
('fr', 'A2', 'ordering', 'Y a-t-il une réduction pour les étudiants?', 4),
('fr', 'A2', 'ordering', 'Puis-je avoir un reçu, s''il vous plaît?', 5),
('fr', 'A2', 'ordering', 'Offrez-vous l''emballage cadeau?', 6),
('fr', 'A2', 'ordering', 'Je cherche quelque chose de spécifique.', 7),
('fr', 'A2', 'ordering', 'Pourriez-vous m''aider à trouver cet article?', 8),
('fr', 'A2', 'ordering', 'Quelle est votre politique de retour?', 9),
('fr', 'A2', 'ordering', 'J''aimerais échanger ceci, s''il vous plaît.', 10),
('fr', 'A2', 'ordering', 'Est-ce disponible dans d''autres couleurs?', 11),
('fr', 'A2', 'ordering', 'Puis-je payer en plusieurs fois?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'A2', 'directions', 'Pourriez-vous me dire comment aller au musée?', 1),
('fr', 'A2', 'directions', 'Est-ce à distance de marche?', 2),
('fr', 'A2', 'directions', 'Combien de temps durera le voyage?', 3),
('fr', 'A2', 'directions', 'De quel quai part le train?', 4),
('fr', 'A2', 'directions', 'Dois-je changer de train?', 5),
('fr', 'A2', 'directions', 'Où puis-je acheter un billet?', 6),
('fr', 'A2', 'directions', 'Y a-t-il un itinéraire direct?', 7),
('fr', 'A2', 'directions', 'Pourriez-vous m''indiquer la bonne direction?', 8),
('fr', 'A2', 'directions', 'Je crois que je suis perdu. Pouvez-vous m''aider?', 9),
('fr', 'A2', 'directions', 'Quel est le meilleur moyen d''y aller?', 10),
('fr', 'A2', 'directions', 'Y a-t-il un parking disponible à proximité?', 11),
('fr', 'A2', 'directions', 'Combien coûte un taxi pour l''aéroport?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'A2', 'food', 'Pourrions-nous avoir une table près de la fenêtre?', 1),
('fr', 'A2', 'food', 'J''aimerais faire une réservation pour deux personnes.', 2),
('fr', 'A2', 'food', 'Quels sont les plats du jour?', 3),
('fr', 'A2', 'food', 'J''ai une allergie alimentaire. Ce plat est-il sûr?', 4),
('fr', 'A2', 'food', 'Pourrais-je avoir ceci sans oignons?', 5),
('fr', 'A2', 'food', 'La nourriture ici est excellente!', 6),
('fr', 'A2', 'food', 'Pourrais-je avoir l''addition, s''il vous plaît?', 7),
('fr', 'A2', 'food', 'Le pourboire est-il inclus dans la facture?', 8),
('fr', 'A2', 'food', 'J''aimerais commander un dessert.', 9),
('fr', 'A2', 'food', 'Pourrais-je avoir un verre d''eau?', 10),
('fr', 'A2', 'food', 'Que recommandez-vous pour un végétarien?', 11),
('fr', 'A2', 'food', 'Le service ici est très bon.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'A2', 'accommodation', 'J''ai fait une réservation en ligne.', 1),
('fr', 'A2', 'accommodation', 'À quelle heure commence le petit-déjeuner?', 2),
('fr', 'A2', 'accommodation', 'Pourrais-je avoir une chambre avec vue?', 3),
('fr', 'A2', 'accommodation', 'Y a-t-il une salle de sport ou une piscine disponible?', 4),
('fr', 'A2', 'accommodation', 'La chambre est très confortable.', 5),
('fr', 'A2', 'accommodation', 'Pourrais-je avoir des oreillers supplémentaires, s''il vous plaît?', 6),
('fr', 'A2', 'accommodation', 'J''aimerais prolonger mon séjour.', 7),
('fr', 'A2', 'accommodation', 'Quelle est votre politique d''annulation?', 8),
('fr', 'A2', 'accommodation', 'Pourriez-vous recommander des restaurants à proximité?', 9),
('fr', 'A2', 'accommodation', 'Y a-t-il une navette pour l''aéroport?', 10),
('fr', 'A2', 'accommodation', 'Je dois faire le check-out tôt demain.', 11),
('fr', 'A2', 'accommodation', 'Pourrais-je garder mes bagages après le check-out?', 12);

-- =====================================================
-- FRENCH (fr) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B1', 'greetings', 'Cela fait un moment que nous ne nous sommes pas vus.', 1),
('fr', 'B1', 'greetings', 'Je voudrais vous présenter mon collègue.', 2),
('fr', 'B1', 'greetings', 'Comment s''est passé votre journée jusqu''à présent?', 3),
('fr', 'B1', 'greetings', 'J''espère que tout va bien pour vous.', 4),
('fr', 'B1', 'greetings', 'C''est merveilleux de vous revoir.', 5),
('fr', 'B1', 'greetings', 'Je pensais à vous contacter.', 6),
('fr', 'B1', 'greetings', 'Restons en contact plus régulièrement.', 7),
('fr', 'B1', 'greetings', 'J''apprécie que vous ayez pris le temps pour cette réunion.', 8),
('fr', 'B1', 'greetings', 'Merci d''être venu avec si peu de préavis.', 9),
('fr', 'B1', 'greetings', 'J''ai hâte à notre future collaboration.', 10),
('fr', 'B1', 'greetings', 'C''était un plaisir de passer du temps avec vous.', 11),
('fr', 'B1', 'greetings', 'J''espère que nous pourrons nous revoir bientôt.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B1', 'ordering', 'Je suis intéressé par l''achat de cet article.', 1),
('fr', 'B1', 'ordering', 'Pourriez-vous fournir plus d''informations sur ce produit?', 2),
('fr', 'B1', 'ordering', 'Quelle est la période de garantie pour cela?', 3),
('fr', 'B1', 'ordering', 'J''aimerais comparer différentes options.', 4),
('fr', 'B1', 'ordering', 'Offrez-vous des réductions promotionnelles?', 5),
('fr', 'B1', 'ordering', 'Pourrais-je voir ceci dans une autre taille?', 6),
('fr', 'B1', 'ordering', 'Je cherche quelque chose de plus abordable.', 7),
('fr', 'B1', 'ordering', 'Quels modes de paiement acceptez-vous?', 8),
('fr', 'B1', 'ordering', 'Pourriez-vous réserver cet article pour moi jusqu''à demain?', 9),
('fr', 'B1', 'ordering', 'J''aimerais retourner cet achat.', 10),
('fr', 'B1', 'ordering', 'Quelle est votre politique d''échange?', 11),
('fr', 'B1', 'ordering', 'Pourrais-je obtenir un reçu cadeau pour cela?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B1', 'directions', 'Je dois trouver l''itinéraire le plus rapide vers le centre-ville.', 1),
('fr', 'B1', 'directions', 'Pourriez-vous expliquer le meilleur moyen d''y arriver?', 2),
('fr', 'B1', 'directions', 'Y a-t-il des transports en commun disponibles?', 3),
('fr', 'B1', 'directions', 'Combien coûterait approximativement un taxi?', 4),
('fr', 'B1', 'directions', 'Je préfère utiliser le métro.', 5),
('fr', 'B1', 'directions', 'Pourriez-vous me montrer sur la carte où nous sommes?', 6),
('fr', 'B1', 'directions', 'Je ne connais pas bien cette zone.', 7),
('fr', 'B1', 'directions', 'Quels points de repère devrais-je chercher?', 8),
('fr', 'B1', 'directions', 'Est-il sûr de marcher là-bas à cette heure?', 9),
('fr', 'B1', 'directions', 'Pourriez-vous recommander un service de taxi fiable?', 10),
('fr', 'B1', 'directions', 'Je dois prendre un vol, donc le temps est important.', 11),
('fr', 'B1', 'directions', 'Y a-t-il des fermetures de routes que je devrais connaître?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B1', 'food', 'J''aimerais faire une réservation pour dîner ce week-end.', 1),
('fr', 'B1', 'food', 'Avez-vous des options végétariennes au menu?', 2),
('fr', 'B1', 'food', 'J''ai des restrictions alimentaires. Pouvez-vous les accommoder?', 3),
('fr', 'B1', 'food', 'Quelle est la recommandation du chef pour aujourd''hui?', 4),
('fr', 'B1', 'food', 'Pourrais-je avoir ce plat préparé sans produits laitiers?', 5),
('fr', 'B1', 'food', 'La présentation de la nourriture est impressionnante.', 6),
('fr', 'B1', 'food', 'J''aimerais complimenter le chef pour ce repas.', 7),
('fr', 'B1', 'food', 'Pourrions-nous partager l''addition, s''il vous plaît?', 8),
('fr', 'B1', 'food', 'Y a-t-il des frais de service inclus?', 9),
('fr', 'B1', 'food', 'J''aimerais commander une bouteille de vin.', 10),
('fr', 'B1', 'food', 'Pourriez-vous recommander un bon restaurant local?', 11),
('fr', 'B1', 'food', 'L''atmosphère ici est très agréable.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B1', 'accommodation', 'J''ai réservé une chambre via votre site web.', 1),
('fr', 'B1', 'accommodation', 'Quels équipements sont inclus dans la chambre?', 2),
('fr', 'B1', 'accommodation', 'Je préférerais une chambre à un étage plus élevé.', 3),
('fr', 'B1', 'accommodation', 'Y a-t-il un service en chambre disponible?', 4),
('fr', 'B1', 'accommodation', 'Pourrais-je avoir un check-out tardif, s''il vous plaît?', 5),
('fr', 'B1', 'accommodation', 'Je dois annuler ma réservation.', 6),
('fr', 'B1', 'accommodation', 'Quelle est votre politique concernant les animaux de compagnie?', 7),
('fr', 'B1', 'accommodation', 'Pourriez-vous organiser un transport vers l''aéroport?', 8),
('fr', 'B1', 'accommodation', 'J''aimerais prolonger ma réservation d''une nuit.', 9),
('fr', 'B1', 'accommodation', 'Y a-t-il des attractions touristiques à proximité?', 10),
('fr', 'B1', 'accommodation', 'Pourriez-vous fournir une carte de la région locale?', 11),
('fr', 'B1', 'accommodation', 'Je suis très satisfait du service ici.', 12);

-- =====================================================
-- FRENCH (fr) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B2', 'greetings', 'J''attendais cette réunion avec impatience.', 1),
('fr', 'B2', 'greetings', 'C''est un honneur de faire votre connaissance.', 2),
('fr', 'B2', 'greetings', 'J''espère que nous pourrons établir une relation productive.', 3),
('fr', 'B2', 'greetings', 'Merci d''avoir pris le temps dans votre emploi du temps chargé.', 4),
('fr', 'B2', 'greetings', 'J''apprécie l''opportunité de me connecter avec vous.', 5),
('fr', 'B2', 'greetings', 'Maintenons une communication régulière à partir de maintenant.', 6),
('fr', 'B2', 'greetings', 'Je valorise notre relation professionnelle.', 7),
('fr', 'B2', 'greetings', 'C''était un plaisir de discuter de cette question avec vous.', 8),
('fr', 'B2', 'greetings', 'J''ai hâte à notre collaboration continue.', 9),
('fr', 'B2', 'greetings', 'Merci pour votre hospitalité et votre accueil chaleureux.', 10),
('fr', 'B2', 'greetings', 'J''espère que nous pourrons nous revoir dans de meilleures circonstances.', 11),
('fr', 'B2', 'greetings', 'Je suis reconnaissant pour votre temps et votre considération.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B2', 'ordering', 'Je considère faire un achat important.', 1),
('fr', 'B2', 'ordering', 'Pourriez-vous fournir des spécifications détaillées pour ce produit?', 2),
('fr', 'B2', 'ordering', 'J''aimerais négocier les termes de cette transaction.', 3),
('fr', 'B2', 'ordering', 'Quelles sont les options de financement disponibles?', 4),
('fr', 'B2', 'ordering', 'Je dois consulter quelqu''un avant de prendre une décision.', 5),
('fr', 'B2', 'ordering', 'Pourriez-vous offrir un meilleur prix pour un achat en gros?', 6),
('fr', 'B2', 'ordering', 'Je suis intéressé par votre forfait de service premium.', 7),
('fr', 'B2', 'ordering', 'Quelle est votre politique concernant les défauts de produit?', 8),
('fr', 'B2', 'ordering', 'J''aimerais organiser un plan de paiement.', 9),
('fr', 'B2', 'ordering', 'Pourriez-vous fournir une facture détaillée pour cet achat?', 10),
('fr', 'B2', 'ordering', 'Je dois retourner cet article en raison d''un défaut de fabrication.', 11),
('fr', 'B2', 'ordering', 'Quelle est votre garantie de satisfaction client?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B2', 'directions', 'J''ai besoin d''instructions détaillées pour atteindre ma destination efficacement.', 1),
('fr', 'B2', 'directions', 'Pourriez-vous suggérer l''itinéraire le plus pittoresque?', 2),
('fr', 'B2', 'directions', 'Je suis préoccupé par les conditions de circulation à ce moment.', 3),
('fr', 'B2', 'directions', 'Quel est le mode de transport le plus fiable?', 4),
('fr', 'B2', 'directions', 'Je préfère éviter les routes à péage si possible.', 5),
('fr', 'B2', 'directions', 'Pourriez-vous recommander une application de navigation pour cette zone?', 6),
('fr', 'B2', 'directions', 'Je dois coordonner plusieurs arrêts lors de mon voyage.', 7),
('fr', 'B2', 'directions', 'Quel est le temps de voyage estimé compte tenu des conditions actuelles?', 8),
('fr', 'B2', 'directions', 'J''aimerais connaître des itinéraires alternatifs.', 9),
('fr', 'B2', 'directions', 'Pourriez-vous fournir des informations sur les installations de stationnement?', 10),
('fr', 'B2', 'directions', 'Je dois organiser un transport pour un groupe.', 11),
('fr', 'B2', 'directions', 'Quelles sont les considérations de sécurité pour cet itinéraire?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B2', 'food', 'J''aimerais faire une réservation pour une occasion spéciale.', 1),
('fr', 'B2', 'food', 'Pourriez-vous accueillir un groupe de huit personnes?', 2),
('fr', 'B2', 'food', 'J''ai des exigences diététiques spécifiques qui doivent être prises en compte.', 3),
('fr', 'B2', 'food', 'Quelle est l''approche du restaurant en matière d''approvisionnement durable?', 4),
('fr', 'B2', 'food', 'J''aimerais discuter des options d''accords mets et vins.', 5),
('fr', 'B2', 'food', 'L''expérience culinaire ici est exceptionnelle.', 6),
('fr', 'B2', 'food', 'J''aimerais fournir des commentaires sur la qualité du service.', 7),
('fr', 'B2', 'food', 'Pourrions-nous organiser un espace de restauration privé?', 8),
('fr', 'B2', 'food', 'Je suis intéressé par le menu de dégustation du chef.', 9),
('fr', 'B2', 'food', 'Quelle est votre politique concernant l''apport de boissons extérieures?', 10),
('fr', 'B2', 'food', 'J''aimerais organiser un dîner d''entreprise ici.', 11),
('fr', 'B2', 'food', 'La combinaison de présentation et de saveur est exceptionnelle.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'B2', 'accommodation', 'J''ai fait une réservation via une plateforme de réservation tierce.', 1),
('fr', 'B2', 'accommodation', 'Quels équipements premium sont disponibles dans vos suites?', 2),
('fr', 'B2', 'accommodation', 'J''aimerais demander une chambre avec des caractéristiques spécifiques.', 3),
('fr', 'B2', 'accommodation', 'Pourriez-vous fournir des informations sur votre programme de fidélité?', 4),
('fr', 'B2', 'accommodation', 'Je dois modifier les détails de ma réservation.', 5),
('fr', 'B2', 'accommodation', 'Quelle est votre politique concernant le check-in anticipé?', 6),
('fr', 'B2', 'accommodation', 'J''aimerais organiser des services supplémentaires pendant mon séjour.', 7),
('fr', 'B2', 'accommodation', 'Pourriez-vous recommander des activités pour les voyageurs d''affaires?', 8),
('fr', 'B2', 'accommodation', 'Je dois discuter des conditions d''annulation en détail.', 9),
('fr', 'B2', 'accommodation', 'Quelles installations de conférence avez-vous disponibles?', 10),
('fr', 'B2', 'accommodation', 'J''aimerais fournir des commentaires sur mon expérience.', 11),
('fr', 'B2', 'accommodation', 'Le niveau de service ici dépasse mes attentes.', 12);

-- =====================================================
-- FRENCH (fr) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C1', 'greetings', 'J''anticipais cette opportunité de me connecter avec vous.', 1),
('fr', 'C1', 'greetings', 'C''est un privilège d''être présenté à des individus si distingués.', 2),
('fr', 'C1', 'greetings', 'J''espère que nous pourrons favoriser une relation professionnelle mutuellement bénéfique.', 3),
('fr', 'C1', 'greetings', 'Merci d''avoir accommodé cette réunion malgré votre emploi du temps exigeant.', 4),
('fr', 'C1', 'greetings', 'J''apprécie l''opportunité de participer à un dialogue significatif avec vous.', 5),
('fr', 'C1', 'greetings', 'Établissons un cadre pour une communication et collaboration continues.', 6),
('fr', 'C1', 'greetings', 'Je valorise la profondeur et la qualité de nos interactions professionnelles.', 7),
('fr', 'C1', 'greetings', 'Il était intellectuellement stimulant d''échanger des perspectives avec vous.', 8),
('fr', 'C1', 'greetings', 'J''ai hâte d''explorer les synergies potentielles entre nos organisations.', 9),
('fr', 'C1', 'greetings', 'Merci pour votre hospitalité gracieuse et vos arrangements réfléchis.', 10),
('fr', 'C1', 'greetings', 'J''espère que nous pourrons nous réunir à nouveau dans des circonstances plus favorables.', 11),
('fr', 'C1', 'greetings', 'Je suis profondément reconnaissant pour votre temps et vos idées professionnelles.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C1', 'ordering', 'J''évalue cet achat dans le cadre d''une stratégie d''approvisionnement plus large.', 1),
('fr', 'C1', 'ordering', 'Pourriez-vous fournir une documentation technique complète pour ce produit?', 2),
('fr', 'C1', 'ordering', 'J''aimerais engager des négociations concernant les termes commerciaux.', 3),
('fr', 'C1', 'ordering', 'Quels arrangements de financement structurés avez-vous disponibles?', 4),
('fr', 'C1', 'ordering', 'Je dois effectuer une diligence raisonnable avant de finaliser cette transaction.', 5),
('fr', 'C1', 'ordering', 'Pourriez-vous proposer une structure de remise sur volume pour les clients d''entreprise?', 6),
('fr', 'C1', 'ordering', 'Je suis intéressé par votre forfait de service et support complet.', 7),
('fr', 'C1', 'ordering', 'Quel est votre cadre d''assurance qualité et de garantie?', 8),
('fr', 'C1', 'ordering', 'J''aimerais établir un arrangement de paiement flexible.', 9),
('fr', 'C1', 'ordering', 'Pourriez-vous générer une facture commerciale détaillée avec répartition par poste?', 10),
('fr', 'C1', 'ordering', 'Je dois initier un processus de retour en raison du non-respect des spécifications.', 11),
('fr', 'C1', 'ordering', 'Quel est votre mécanisme de satisfaction client et de résolution des litiges?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C1', 'directions', 'Je nécessite des conseils de navigation complets pour optimiser mon itinéraire de voyage.', 1),
('fr', 'C1', 'directions', 'Pourriez-vous recommander des itinéraires qui offrent à la fois efficacité et valeur panoramique?', 2),
('fr', 'C1', 'directions', 'Je surveille les modèles de trafic pour déterminer les heures de départ optimales.', 3),
('fr', 'C1', 'directions', 'Quelles options de transport offrent le meilleur ratio fiabilité-coût?', 4),
('fr', 'C1', 'directions', 'Je préfère minimiser les dépenses de péage tout en maintenant un temps de voyage raisonnable.', 5),
('fr', 'C1', 'directions', 'Pourriez-vous recommander des solutions de navigation qui intègrent les données de trafic en temps réel?', 6),
('fr', 'C1', 'directions', 'Je dois coordonner un itinéraire multi-étapes avec des rendez-vous sensibles au temps.', 7),
('fr', 'C1', 'directions', 'Quelle est la durée de voyage projetée compte tenu des conditions de trafic actuelles?', 8),
('fr', 'C1', 'directions', 'J''apprécierais des informations sur les stratégies de routage alternatives.', 9),
('fr', 'C1', 'directions', 'Pourriez-vous fournir des détails sur l''infrastructure et la disponibilité du stationnement?', 10),
('fr', 'C1', 'directions', 'Je dois organiser la logistique de transport pour une délégation d''entreprise.', 11),
('fr', 'C1', 'directions', 'Quelles considérations de sécurité et de protection devraient informer la sélection d''itinéraire?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C1', 'food', 'J''aimerais organiser une réservation pour un événement célébratoire significatif.', 1),
('fr', 'C1', 'food', 'Pourriez-vous accueillir un groupe substantiel tout en maintenant la qualité du service?', 2),
('fr', 'C1', 'food', 'J''ai des exigences diététiques complexes qui nécessitent une considération attentive.', 3),
('fr', 'C1', 'food', 'Quel est l''engagement de l''établissement envers les pratiques d''approvisionnement durables et éthiques?', 4),
('fr', 'C1', 'food', 'J''aimerais consulter votre sommelier concernant les accords mets et vins.', 5),
('fr', 'C1', 'food', 'L''expérience gastronomique ici démontre un art culinaire exceptionnel.', 6),
('fr', 'C1', 'food', 'J''aimerais fournir des commentaires complets sur les normes de prestation de service.', 7),
('fr', 'C1', 'food', 'Pourrions-nous organiser un espace de restauration exclusif pour notre groupe?', 8),
('fr', 'C1', 'food', 'Je suis intéressé par l''expérience du menu de dégustation du chef.', 9),
('fr', 'C1', 'food', 'Quelle est votre politique concernant le service de boissons extérieures et les frais de bouchon?', 10),
('fr', 'C1', 'food', 'J''aimerais organiser un événement d''hospitalité d''entreprise dans votre lieu.', 11),
('fr', 'C1', 'food', 'La présentation et le profil de saveur démontrent une technique culinaire sophistiquée.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C1', 'accommodation', 'J''ai sécurisé une réservation via une plateforme agrégatrice de voyages en ligne.', 1),
('fr', 'C1', 'accommodation', 'Quels équipements et services premium sont disponibles dans vos suites exécutives?', 2),
('fr', 'C1', 'accommodation', 'J''aimerais demander des hébergements avec des exigences fonctionnelles spécifiques.', 3),
('fr', 'C1', 'accommodation', 'Pourriez-vous fournir des informations sur votre programme de fidélité et de récompenses pour les invités?', 4),
('fr', 'C1', 'accommodation', 'Je dois modifier les paramètres de réservation pour accommoder des circonstances changeantes.', 5),
('fr', 'C1', 'accommodation', 'Quel est votre cadre de politique concernant le check-in anticipé et le check-out tardif?', 6),
('fr', 'C1', 'accommodation', 'J''aimerais organiser des services de conciergerie supplémentaires pendant mon séjour.', 7),
('fr', 'C1', 'accommodation', 'Pourriez-vous recommander des équipements et installations axés sur les affaires?', 8),
('fr', 'C1', 'accommodation', 'Je dois examiner les termes et conditions d''annulation en détail.', 9),
('fr', 'C1', 'accommodation', 'Quelles installations de conférence et de réunion avez-vous disponibles pour les événements d''entreprise?', 10),
('fr', 'C1', 'accommodation', 'J''aimerais fournir des commentaires détaillés sur mon expérience d''invité.', 11),
('fr', 'C1', 'accommodation', 'La prestation de service ici dépasse constamment les références de l''industrie.', 12);

-- =====================================================
-- FRENCH (fr) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C2', 'greetings', 'J''attendais avec impatience cette opportunité d''établir une connexion professionnelle significative.', 1),
('fr', 'C2', 'greetings', 'C''est vraiment un honneur d''être présenté à des professionnels si accomplis et distingués.', 2),
('fr', 'C2', 'greetings', 'J''espère que nous pourrons cultiver une relation professionnelle mutuellement avantageuse et durable.', 3),
('fr', 'C2', 'greetings', 'Merci d''avoir gracieusement accommodé cette réunion malgré votre emploi du temps extrêmement exigeant.', 4),
('fr', 'C2', 'greetings', 'J''apprécie profondément l''opportunité de participer à un dialogue substantiel et intellectuellement stimulant.', 5),
('fr', 'C2', 'greetings', 'Établissons un cadre robuste pour une communication soutenue et une collaboration stratégique.', 6),
('fr', 'C2', 'greetings', 'Je valorise hautement la sophistication et la profondeur de nos interactions professionnelles.', 7),
('fr', 'C2', 'greetings', 'Il était intellectuellement enrichissant d''échanger des perspectives et idées nuancées avec vous.', 8),
('fr', 'C2', 'greetings', 'J''ai hâte d''explorer les synergies potentielles et opportunités de collaboration entre nos organisations.', 9),
('fr', 'C2', 'greetings', 'Merci pour votre hospitalité exceptionnelle et vos arrangements méticuleusement réfléchis.', 10),
('fr', 'C2', 'greetings', 'J''espère que nous pourrons nous réunir à nouveau dans des circonstances encore plus propices au discours productif.', 11),
('fr', 'C2', 'greetings', 'Je suis profondément reconnaissant pour votre temps précieux et vos contributions professionnelles perspicaces.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C2', 'ordering', 'Je mène une évaluation complète de cet achat dans le contexte de notre stratégie d''approvisionnement plus large.', 1),
('fr', 'C2', 'ordering', 'Pourriez-vous fournir une documentation technique exhaustive et des certifications de conformité pour ce produit?', 2),
('fr', 'C2', 'ordering', 'J''aimerais engager des négociations sophistiquées concernant les termes commerciaux et contractuels.', 3),
('fr', 'C2', 'ordering', 'Quels arrangements de financement structurés et termes de paiement avez-vous disponibles pour les clients d''entreprise?', 4),
('fr', 'C2', 'ordering', 'Je dois effectuer une diligence raisonnable exhaustive et une évaluation des risques avant de finaliser cette transaction.', 5),
('fr', 'C2', 'ordering', 'Pourriez-vous proposer une structure complète de remise sur volume avec tarification à plusieurs niveaux pour les approvisionnements à grande échelle?', 6),
('fr', 'C2', 'ordering', 'Je suis intéressé par votre forfait de service premium qui inclut un support et une maintenance complets.', 7),
('fr', 'C2', 'ordering', 'Quel est votre cadre d''assurance qualité, couverture de garantie et infrastructure de support post-vente?', 8),
('fr', 'C2', 'ordering', 'J''aimerais établir un arrangement de paiement flexible qui s''adapte à nos cycles de planification financière.', 9),
('fr', 'C2', 'ordering', 'Pourriez-vous générer une facture commerciale détaillée avec répartition complète par poste et documentation fiscale?', 10),
('fr', 'C2', 'ordering', 'Je dois initier un processus de retour formel en raison du non-respect des exigences techniques spécifiées.', 11),
('fr', 'C2', 'ordering', 'Quelle est votre garantie complète de satisfaction client et mécanisme de résolution des litiges?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C2', 'directions', 'Je nécessite des conseils de navigation complets pour optimiser mon itinéraire de voyage tout en minimisant le temps de transit et le coût.', 1),
('fr', 'C2', 'directions', 'Pourriez-vous recommander des itinéraires qui offrent un équilibre optimal entre efficacité, valeur panoramique et considérations de sécurité?', 2),
('fr', 'C2', 'directions', 'Je surveille les modèles de trafic en temps réel et les données historiques pour déterminer la fenêtre de départ la plus opportune.', 3),
('fr', 'C2', 'directions', 'Quelles modalités de transport offrent le ratio fiabilité-coût le plus favorable pour ce voyage particulier?', 4),
('fr', 'C2', 'directions', 'Je préfère minimiser les dépenses de péage tout en maintenant une durée de voyage raisonnable et une efficacité d''itinéraire.', 5),
('fr', 'C2', 'directions', 'Pourriez-vous recommander des solutions de navigation avancées qui intègrent les données de trafic en temps réel et l''analyse prédictive?', 6),
('fr', 'C2', 'directions', 'Je dois coordonner un itinéraire complexe multi-étapes avec des rendez-vous sensibles au temps et des contraintes logistiques.', 7),
('fr', 'C2', 'directions', 'Quelle est la durée de voyage projetée compte tenu des conditions de trafic actuelles, des retards potentiels et de l''optimisation d''itinéraire?', 8),
('fr', 'C2', 'directions', 'J''apprécierais des informations complètes sur les stratégies de routage alternatives et la planification de contingence.', 9),
('fr', 'C2', 'directions', 'Pourriez-vous fournir des informations détaillées sur l''infrastructure de stationnement, la disponibilité, la tarification et les options de réservation?', 10),
('fr', 'C2', 'directions', 'Je dois organiser une logistique de transport sophistiquée pour une délégation d''entreprise avec des exigences spécifiques.', 11),
('fr', 'C2', 'directions', 'Quelles considérations de sécurité, de protection et d''atténuation des risques devraient informer notre stratégie de sélection d''itinéraire?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C2', 'food', 'J''aimerais organiser une réservation pour un événement célébratoire significatif avec des exigences et attentes spécifiques.', 1),
('fr', 'C2', 'food', 'Pourriez-vous accueillir un groupe substantiel tout en maintenant une qualité de service exceptionnelle et une attention aux détails?', 2),
('fr', 'C2', 'food', 'J''ai des exigences et préférences diététiques complexes qui nécessitent une considération attentive et une préparation personnalisée.', 3),
('fr', 'C2', 'food', 'Quel est l''engagement de l''établissement envers l''approvisionnement durable, les pratiques éthiques et la responsabilité environnementale?', 4),
('fr', 'C2', 'food', 'J''aimerais consulter votre sommelier concernant des accords mets et vins sophistiqués qui complètent l''expérience culinaire.', 5),
('fr', 'C2', 'food', 'L''expérience gastronomique ici démontre un art culinaire exceptionnel et des combinaisons de saveurs innovantes.', 6),
('fr', 'C2', 'food', 'J''aimerais fournir des commentaires complets sur les normes de prestation de service et l''expérience globale de restauration.', 7),
('fr', 'C2', 'food', 'Pourrions-nous organiser un espace de restauration exclusif qui fournit l''intimité et une atmosphère améliorée pour notre groupe?', 8),
('fr', 'C2', 'food', 'Je suis intéressé par l''expérience du menu de dégustation du chef qui montre toute la gamme des capacités culinaires.', 9),
('fr', 'C2', 'food', 'Quelle est votre politique concernant le service de boissons extérieures, les frais de bouchon et les arrangements pour occasions spéciales?', 10),
('fr', 'C2', 'food', 'J''aimerais organiser un événement d''hospitalité d''entreprise dans votre lieu avec des exigences et attentes spécifiques.', 11),
('fr', 'C2', 'food', 'La présentation, le profil de saveur et la technique culinaire démontrent une expertise gastronomique sophistiquée.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('fr', 'C2', 'accommodation', 'J''ai sécurisé une réservation via une plateforme agrégatrice de voyages en ligne et je dois vérifier les détails.', 1),
('fr', 'C2', 'accommodation', 'Quels équipements premium, services personnalisés et installations exclusives sont disponibles dans vos suites exécutives?', 2),
('fr', 'C2', 'accommodation', 'J''aimerais demander des hébergements avec des exigences fonctionnelles spécifiques et des considérations d''accessibilité.', 3),
('fr', 'C2', 'accommodation', 'Pourriez-vous fournir des informations complètes sur votre programme de fidélité des invités, structure de récompenses et avantages d''adhésion?', 4),
('fr', 'C2', 'accommodation', 'Je dois modifier les paramètres de réservation pour accommoder des circonstances changeantes tout en maintenant des termes favorables.', 5),
('fr', 'C2', 'accommodation', 'Quel est votre cadre de politique concernant le check-in anticipé, le check-out tardif et les arrangements d''hébergement flexibles?', 6),
('fr', 'C2', 'accommodation', 'J''aimerais organiser des services de conciergerie supplémentaires et une assistance personnalisée pendant mon séjour prolongé.', 7),
('fr', 'C2', 'accommodation', 'Pourriez-vous recommander des équipements, installations et services axés sur les affaires pour les voyageurs d''affaires?', 8),
('fr', 'C2', 'accommodation', 'Je dois examiner les termes d''annulation, conditions et implications financières potentielles en détail complet.', 9),
('fr', 'C2', 'accommodation', 'Quelles installations de conférence, espaces de réunion et capacités d''événements avez-vous disponibles pour les fonctions d''entreprise?', 10),
('fr', 'C2', 'accommodation', 'J''aimerais fournir des commentaires détaillés sur mon expérience d''invité et les normes de prestation de service.', 11),
('fr', 'C2', 'accommodation', 'La prestation de service ici dépasse constamment les références de l''industrie et démontre des normes d''hospitalité exceptionnelles.', 12);

-- =====================================================
-- ITALIAN (it) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'A2', 'greetings', 'Buongiorno! Come hai dormito?', 1),
('it', 'A2', 'greetings', 'È un piacere conoscerti.', 2),
('it', 'A2', 'greetings', 'Come stai ultimamente?', 3),
('it', 'A2', 'greetings', 'Sto bene, grazie per aver chiesto.', 4),
('it', 'A2', 'greetings', 'Cosa ti porta qui oggi?', 5),
('it', 'A2', 'greetings', 'Spero che possiamo restare in contatto.', 6),
('it', 'A2', 'greetings', 'È stato bello rimetterci in contatto.', 7),
('it', 'A2', 'greetings', 'Abbi cura di te e a presto!', 8),
('it', 'A2', 'greetings', 'Non vedo l''ora di rivederti.', 9),
('it', 'A2', 'greetings', 'Ti auguro una giornata meravigliosa!', 10),
('it', 'A2', 'greetings', 'Grazie per il tuo tempo.', 11),
('it', 'A2', 'greetings', 'Apprezzo che tu abbia trovato il tempo per questo incontro.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'A2', 'ordering', 'Potrei vedere il menu, per favore?', 1),
('it', 'A2', 'ordering', 'Cosa consiglieresti?', 2),
('it', 'A2', 'ordering', 'Vorrei provare qualcosa di locale.', 3),
('it', 'A2', 'ordering', 'C''è uno sconto per gli studenti?', 4),
('it', 'A2', 'ordering', 'Posso avere uno scontrino, per favore?', 5),
('it', 'A2', 'ordering', 'Offrite l''imballaggio regalo?', 6),
('it', 'A2', 'ordering', 'Sto cercando qualcosa di specifico.', 7),
('it', 'A2', 'ordering', 'Potresti aiutarmi a trovare questo articolo?', 8),
('it', 'A2', 'ordering', 'Qual è la vostra politica di reso?', 9),
('it', 'A2', 'ordering', 'Vorrei scambiare questo, per favore.', 10),
('it', 'A2', 'ordering', 'È disponibile in altri colori?', 11),
('it', 'A2', 'ordering', 'Posso pagare a rate?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'A2', 'directions', 'Potresti dirmi come arrivare al museo?', 1),
('it', 'A2', 'directions', 'È a distanza di camminata?', 2),
('it', 'A2', 'directions', 'Quanto durerà il viaggio?', 3),
('it', 'A2', 'directions', 'Da quale binario parte il treno?', 4),
('it', 'A2', 'directions', 'Devo cambiare treno?', 5),
('it', 'A2', 'directions', 'Dove posso comprare un biglietto?', 6),
('it', 'A2', 'directions', 'C''è una rotta diretta?', 7),
('it', 'A2', 'directions', 'Potresti indicarmi la direzione giusta?', 8),
('it', 'A2', 'directions', 'Credo di essermi perso. Puoi aiutarmi?', 9),
('it', 'A2', 'directions', 'Qual è il modo migliore per arrivarci?', 10),
('it', 'A2', 'directions', 'C''è un parcheggio disponibile nelle vicinanze?', 11),
('it', 'A2', 'directions', 'Quanto costa un taxi per l''aeroporto?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'A2', 'food', 'Potremmo avere un tavolo vicino alla finestra?', 1),
('it', 'A2', 'food', 'Vorrei fare una prenotazione per due persone.', 2),
('it', 'A2', 'food', 'Quali sono i piatti del giorno?', 3),
('it', 'A2', 'food', 'Ho un''allergia alimentare. Questo piatto è sicuro?', 4),
('it', 'A2', 'food', 'Potrei avere questo senza cipolle?', 5),
('it', 'A2', 'food', 'Il cibo qui è eccellente!', 6),
('it', 'A2', 'food', 'Potrei avere il conto, per favore?', 7),
('it', 'A2', 'food', 'La mancia è inclusa nel conto?', 8),
('it', 'A2', 'food', 'Vorrei ordinare un dessert.', 9),
('it', 'A2', 'food', 'Potrei avere un bicchiere d''acqua?', 10),
('it', 'A2', 'food', 'Cosa consigli per un vegetariano?', 11),
('it', 'A2', 'food', 'Il servizio qui è molto buono.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'A2', 'accommodation', 'Ho fatto una prenotazione online.', 1),
('it', 'A2', 'accommodation', 'A che ora inizia la colazione?', 2),
('it', 'A2', 'accommodation', 'Potrei avere una camera con vista?', 3),
('it', 'A2', 'accommodation', 'C''è una palestra o una piscina disponibile?', 4),
('it', 'A2', 'accommodation', 'La camera è molto confortevole.', 5),
('it', 'A2', 'accommodation', 'Potrei avere cuscini extra, per favore?', 6),
('it', 'A2', 'accommodation', 'Vorrei prolungare il mio soggiorno.', 7),
('it', 'A2', 'accommodation', 'Qual è la vostra politica di cancellazione?', 8),
('it', 'A2', 'accommodation', 'Potresti raccomandare ristoranti nelle vicinanze?', 9),
('it', 'A2', 'accommodation', 'C''è una navetta per l''aeroporto?', 10),
('it', 'A2', 'accommodation', 'Devo fare il check-out presto domani.', 11),
('it', 'A2', 'accommodation', 'Potrei conservare i miei bagagli dopo il check-out?', 12);

-- =====================================================
-- ITALIAN (it) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B1', 'greetings', 'È passato un po'' di tempo dall''ultima volta che ci siamo visti.', 1),
('it', 'B1', 'greetings', 'Vorrei presentarti il mio collega.', 2),
('it', 'B1', 'greetings', 'Com''è andata la tua giornata finora?', 3),
('it', 'B1', 'greetings', 'Spero che tutto vada bene per te.', 4),
('it', 'B1', 'greetings', 'È meraviglioso rivederti.', 5),
('it', 'B1', 'greetings', 'Stavo pensando di mettermi in contatto.', 6),
('it', 'B1', 'greetings', 'Rimaniamo in contatto più regolarmente.', 7),
('it', 'B1', 'greetings', 'Apprezzo che tu abbia trovato il tempo per questo incontro.', 8),
('it', 'B1', 'greetings', 'Grazie per essere venuto con così poco preavviso.', 9),
('it', 'B1', 'greetings', 'Non vedo l''ora della nostra futura collaborazione.', 10),
('it', 'B1', 'greetings', 'È stato un piacere passare del tempo con te.', 11),
('it', 'B1', 'greetings', 'Spero che possiamo incontrarci di nuovo presto.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B1', 'ordering', 'Sono interessato all''acquisto di questo articolo.', 1),
('it', 'B1', 'ordering', 'Potresti fornire più informazioni su questo prodotto?', 2),
('it', 'B1', 'ordering', 'Qual è il periodo di garanzia per questo?', 3),
('it', 'B1', 'ordering', 'Vorrei confrontare diverse opzioni.', 4),
('it', 'B1', 'ordering', 'Offrite sconti promozionali?', 5),
('it', 'B1', 'ordering', 'Potrei vedere questo in una taglia diversa?', 6),
('it', 'B1', 'ordering', 'Sto cercando qualcosa di più economico.', 7),
('it', 'B1', 'ordering', 'Quali metodi di pagamento accettate?', 8),
('it', 'B1', 'ordering', 'Potresti tenere questo articolo per me fino a domani?', 9),
('it', 'B1', 'ordering', 'Vorrei restituire questo acquisto.', 10),
('it', 'B1', 'ordering', 'Qual è la vostra politica di scambio?', 11),
('it', 'B1', 'ordering', 'Potrei ottenere uno scontrino regalo per questo?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B1', 'directions', 'Devo trovare la rotta più veloce per il centro città.', 1),
('it', 'B1', 'directions', 'Potresti spiegarmi il modo migliore per arrivarci?', 2),
('it', 'B1', 'directions', 'C''è trasporto pubblico disponibile?', 3),
('it', 'B1', 'directions', 'Quanto costerebbe approssimativamente un taxi?', 4),
('it', 'B1', 'directions', 'Preferisco usare la metropolitana.', 5),
('it', 'B1', 'directions', 'Potresti mostrarmi sulla mappa dove siamo?', 6),
('it', 'B1', 'directions', 'Non conosco bene questa zona.', 7),
('it', 'B1', 'directions', 'Quali punti di riferimento dovrei cercare?', 8),
('it', 'B1', 'directions', 'È sicuro camminare lì a quest''ora?', 9),
('it', 'B1', 'directions', 'Potresti raccomandare un servizio taxi affidabile?', 10),
('it', 'B1', 'directions', 'Devo prendere un volo, quindi il tempo è importante.', 11),
('it', 'B1', 'directions', 'Ci sono chiusure stradali che dovrei sapere?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B1', 'food', 'Vorrei fare una prenotazione per cena questo fine settimana.', 1),
('it', 'B1', 'food', 'Avete opzioni vegetariane nel menu?', 2),
('it', 'B1', 'food', 'Ho restrizioni dietetiche. Potete accoglierle?', 3),
('it', 'B1', 'food', 'Qual è la raccomandazione dello chef per oggi?', 4),
('it', 'B1', 'food', 'Potrei avere questo piatto preparato senza latticini?', 5),
('it', 'B1', 'food', 'La presentazione del cibo è impressionante.', 6),
('it', 'B1', 'food', 'Vorrei complimentarmi con lo chef per questo pasto.', 7),
('it', 'B1', 'food', 'Potremmo dividere il conto, per favore?', 8),
('it', 'B1', 'food', 'C''è un costo di servizio incluso?', 9),
('it', 'B1', 'food', 'Vorrei ordinare una bottiglia di vino.', 10),
('it', 'B1', 'food', 'Potresti raccomandare un buon ristorante locale?', 11),
('it', 'B1', 'food', 'L''atmosfera qui è molto piacevole.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B1', 'accommodation', 'Ho prenotato una camera tramite il vostro sito web.', 1),
('it', 'B1', 'accommodation', 'Quali servizi sono inclusi nella camera?', 2),
('it', 'B1', 'accommodation', 'Preferirei una camera a un piano più alto.', 3),
('it', 'B1', 'accommodation', 'C''è un servizio in camera disponibile?', 4),
('it', 'B1', 'accommodation', 'Potrei avere un check-out tardivo, per favore?', 5),
('it', 'B1', 'accommodation', 'Devo cancellare la mia prenotazione.', 6),
('it', 'B1', 'accommodation', 'Qual è la vostra politica riguardo agli animali domestici?', 7),
('it', 'B1', 'accommodation', 'Potreste organizzare un trasporto per l''aeroporto?', 8),
('it', 'B1', 'accommodation', 'Vorrei prolungare la mia prenotazione di una notte.', 9),
('it', 'B1', 'accommodation', 'Ci sono attrazioni turistiche nelle vicinanze?', 10),
('it', 'B1', 'accommodation', 'Potreste fornire una mappa dell''area locale?', 11),
('it', 'B1', 'accommodation', 'Sono molto soddisfatto del servizio qui.', 12);

-- =====================================================
-- ITALIAN (it) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B2', 'greetings', 'Stavo aspettando questo incontro con impazienza.', 1),
('it', 'B2', 'greetings', 'È un onore fare la tua conoscenza.', 2),
('it', 'B2', 'greetings', 'Spero che possiamo stabilire una relazione produttiva.', 3),
('it', 'B2', 'greetings', 'Grazie per aver trovato il tempo nel tuo programma fitto.', 4),
('it', 'B2', 'greetings', 'Apprezzo l''opportunità di connettermi con te.', 5),
('it', 'B2', 'greetings', 'Manteniamo una comunicazione regolare da ora in poi.', 6),
('it', 'B2', 'greetings', 'Valuto la nostra relazione professionale.', 7),
('it', 'B2', 'greetings', 'È stato un piacere discutere questa questione con te.', 8),
('it', 'B2', 'greetings', 'Non vedo l''ora della nostra continua collaborazione.', 9),
('it', 'B2', 'greetings', 'Grazie per la tua ospitalità e il caldo benvenuto.', 10),
('it', 'B2', 'greetings', 'Spero che possiamo incontrarci di nuovo in circostanze migliori.', 11),
('it', 'B2', 'greetings', 'Sono grato per il tuo tempo e considerazione.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B2', 'ordering', 'Sto considerando di fare un acquisto significativo.', 1),
('it', 'B2', 'ordering', 'Potresti fornire specifiche dettagliate per questo prodotto?', 2),
('it', 'B2', 'ordering', 'Vorrei negoziare i termini di questa transazione.', 3),
('it', 'B2', 'ordering', 'Quali sono le opzioni di finanziamento disponibili?', 4),
('it', 'B2', 'ordering', 'Devo consultare qualcuno prima di prendere una decisione.', 5),
('it', 'B2', 'ordering', 'Potresti offrire un prezzo migliore per un acquisto all''ingrosso?', 6),
('it', 'B2', 'ordering', 'Sono interessato al tuo pacchetto di servizio premium.', 7),
('it', 'B2', 'ordering', 'Qual è la vostra politica riguardo ai difetti del prodotto?', 8),
('it', 'B2', 'ordering', 'Vorrei organizzare un piano di pagamento.', 9),
('it', 'B2', 'ordering', 'Potresti fornire una fattura dettagliata per questo acquisto?', 10),
('it', 'B2', 'ordering', 'Devo restituire questo articolo a causa di un difetto di fabbricazione.', 11),
('it', 'B2', 'ordering', 'Qual è la vostra garanzia di soddisfazione del cliente?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B2', 'directions', 'Ho bisogno di indicazioni dettagliate per raggiungere la mia destinazione in modo efficiente.', 1),
('it', 'B2', 'directions', 'Potresti suggerire la rotta più pittoresca?', 2),
('it', 'B2', 'directions', 'Sono preoccupato per le condizioni del traffico in questo momento.', 3),
('it', 'B2', 'directions', 'Qual è il mezzo di trasporto più affidabile?', 4),
('it', 'B2', 'directions', 'Preferisco evitare le strade a pedaggio se possibile.', 5),
('it', 'B2', 'directions', 'Potresti raccomandare un''applicazione di navigazione per questa zona?', 6),
('it', 'B2', 'directions', 'Devo coordinare diverse fermate nel mio viaggio.', 7),
('it', 'B2', 'directions', 'Qual è il tempo di viaggio stimato considerando le condizioni attuali?', 8),
('it', 'B2', 'directions', 'Vorrei conoscere rotte alternative.', 9),
('it', 'B2', 'directions', 'Potresti fornire informazioni sulle strutture di parcheggio?', 10),
('it', 'B2', 'directions', 'Devo organizzare un trasporto per un gruppo.', 11),
('it', 'B2', 'directions', 'Quali sono le considerazioni di sicurezza per questa rotta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B2', 'food', 'Vorrei fare una prenotazione per un''occasione speciale.', 1),
('it', 'B2', 'food', 'Potreste accogliere un gruppo di otto persone?', 2),
('it', 'B2', 'food', 'Ho requisiti dietetici specifici che devono essere considerati.', 3),
('it', 'B2', 'food', 'Qual è l''approccio del ristorante all''approvvigionamento sostenibile?', 4),
('it', 'B2', 'food', 'Vorrei discutere le opzioni di abbinamento vino.', 5),
('it', 'B2', 'food', 'L''esperienza culinaria qui è eccezionale.', 6),
('it', 'B2', 'food', 'Vorrei fornire feedback sulla qualità del servizio.', 7),
('it', 'B2', 'food', 'Potremmo organizzare un''area da pranzo privata?', 8),
('it', 'B2', 'food', 'Sono interessato al menu degustazione dello chef.', 9),
('it', 'B2', 'food', 'Qual è la vostra politica riguardo al portare bevande esterne?', 10),
('it', 'B2', 'food', 'Vorrei organizzare una cena aziendale qui.', 11),
('it', 'B2', 'food', 'La combinazione di presentazione e sapore è eccezionale.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'B2', 'accommodation', 'Ho fatto una prenotazione tramite una piattaforma di prenotazione di terze parti.', 1),
('it', 'B2', 'accommodation', 'Quali servizi premium sono disponibili nelle vostre suite?', 2),
('it', 'B2', 'accommodation', 'Vorrei richiedere una camera con caratteristiche specifiche.', 3),
('it', 'B2', 'accommodation', 'Potreste fornire informazioni sul vostro programma fedeltà?', 4),
('it', 'B2', 'accommodation', 'Devo modificare i dettagli della mia prenotazione.', 5),
('it', 'B2', 'accommodation', 'Qual è la vostra politica riguardo al check-in anticipato?', 6),
('it', 'B2', 'accommodation', 'Vorrei organizzare servizi aggiuntivi durante il mio soggiorno.', 7),
('it', 'B2', 'accommodation', 'Potreste raccomandare attività per viaggiatori d''affari?', 8),
('it', 'B2', 'accommodation', 'Devo discutere i termini di cancellazione in dettaglio.', 9),
('it', 'B2', 'accommodation', 'Quali strutture per conferenze avete disponibili?', 10),
('it', 'B2', 'accommodation', 'Vorrei fornire feedback sulla mia esperienza.', 11),
('it', 'B2', 'accommodation', 'Il livello di servizio qui supera le mie aspettative.', 12);

-- =====================================================
-- ITALIAN (it) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C1', 'greetings', 'Stavo anticipando questa opportunità di connettermi con te.', 1),
('it', 'C1', 'greetings', 'È un privilegio essere presentato a individui così distinti.', 2),
('it', 'C1', 'greetings', 'Spero che possiamo favorire una relazione professionale reciprocamente vantaggiosa.', 3),
('it', 'C1', 'greetings', 'Grazie per aver accolto questo incontro nonostante il tuo programma impegnativo.', 4),
('it', 'C1', 'greetings', 'Apprezzo l''opportunità di partecipare a un dialogo significativo con te.', 5),
('it', 'C1', 'greetings', 'Stabiliamo un quadro per comunicazione e collaborazione continue.', 6),
('it', 'C1', 'greetings', 'Valuto la profondità e qualità delle nostre interazioni professionali.', 7),
('it', 'C1', 'greetings', 'È stato intellettualmente stimolante scambiare prospettive con te.', 8),
('it', 'C1', 'greetings', 'Non vedo l''ora di esplorare sinergie potenziali tra le nostre organizzazioni.', 9),
('it', 'C1', 'greetings', 'Grazie per la tua ospitalità graziosa e arrangiamenti premurosi.', 10),
('it', 'C1', 'greetings', 'Spero che possiamo riunirci di nuovo in circostanze più favorevoli.', 11),
('it', 'C1', 'greetings', 'Sono profondamente grato per il tuo tempo e intuizioni professionali.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C1', 'ordering', 'Sto valutando questo acquisto come parte di una strategia di approvvigionamento più ampia.', 1),
('it', 'C1', 'ordering', 'Potresti fornire documentazione tecnica completa per questo prodotto?', 2),
('it', 'C1', 'ordering', 'Vorrei impegnarmi in negoziazioni riguardo ai termini commerciali.', 3),
('it', 'C1', 'ordering', 'Quali accordi di finanziamento strutturati avete disponibili?', 4),
('it', 'C1', 'ordering', 'Devo condurre una due diligence prima di finalizzare questa transazione.', 5),
('it', 'C1', 'ordering', 'Potresti proporre una struttura di sconto volume per clienti aziendali?', 6),
('it', 'C1', 'ordering', 'Sono interessato al tuo pacchetto completo di servizio e supporto.', 7),
('it', 'C1', 'ordering', 'Qual è il tuo quadro di garanzia qualità e garanzia?', 8),
('it', 'C1', 'ordering', 'Vorrei stabilire un accordo di pagamento flessibile.', 9),
('it', 'C1', 'ordering', 'Potresti generare una fattura commerciale dettagliata con ripartizione per voci?', 10),
('it', 'C1', 'ordering', 'Devo avviare un processo di reso a causa del mancato rispetto delle specifiche.', 11),
('it', 'C1', 'ordering', 'Qual è il tuo meccanismo di soddisfazione del cliente e risoluzione delle controversie?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C1', 'directions', 'Richiedo una guida di navigazione completa per ottimizzare il mio itinerario di viaggio.', 1),
('it', 'C1', 'directions', 'Potresti raccomandare rotte che offrono sia efficienza che valore panoramico?', 2),
('it', 'C1', 'directions', 'Sto monitorando i modelli di traffico per determinare i tempi di partenza ottimali.', 3),
('it', 'C1', 'directions', 'Quali opzioni di trasporto forniscono il miglior rapporto affidabilità-costo?', 4),
('it', 'C1', 'directions', 'Preferisco minimizzare le spese di pedaggio mantenendo un tempo di viaggio ragionevole.', 5),
('it', 'C1', 'directions', 'Potresti raccomandare soluzioni di navigazione che integrano dati di traffico in tempo reale?', 6),
('it', 'C1', 'directions', 'Devo coordinare un itinerario multi-fermata con appuntamenti sensibili al tempo.', 7),
('it', 'C1', 'directions', 'Qual è la durata del viaggio proiettata considerando le condizioni di traffico attuali?', 8),
('it', 'C1', 'directions', 'Apprezzerei informazioni su strategie di routing alternative.', 9),
('it', 'C1', 'directions', 'Potresti fornire dettagli sull''infrastruttura e disponibilità del parcheggio?', 10),
('it', 'C1', 'directions', 'Devo organizzare la logistica del trasporto per una delegazione aziendale.', 11),
('it', 'C1', 'directions', 'Quali considerazioni di sicurezza e protezione dovrebbero informare la selezione della rotta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C1', 'food', 'Vorrei organizzare una prenotazione per un evento celebrativo significativo.', 1),
('it', 'C1', 'food', 'Potreste accogliere un gruppo sostanziale mantenendo la qualità del servizio?', 2),
('it', 'C1', 'food', 'Ho requisiti dietetici complessi che richiedono considerazione attenta.', 3),
('it', 'C1', 'food', 'Qual è l''impegno dell''establishment verso pratiche di approvvigionamento sostenibili ed etiche?', 4),
('it', 'C1', 'food', 'Vorrei consultare il tuo sommelier riguardo agli abbinamenti vino.', 5),
('it', 'C1', 'food', 'L''esperienza gastronomica qui dimostra un''arte culinaria eccezionale.', 6),
('it', 'C1', 'food', 'Vorrei fornire feedback completo sugli standard di erogazione del servizio.', 7),
('it', 'C1', 'food', 'Potremmo organizzare uno spazio da pranzo esclusivo per il nostro gruppo?', 8),
('it', 'C1', 'food', 'Sono interessato all''esperienza del menu degustazione dello chef.', 9),
('it', 'C1', 'food', 'Qual è la tua politica riguardo al servizio di bevande esterne e tariffe di tappo?', 10),
('it', 'C1', 'food', 'Vorrei organizzare un evento di ospitalità aziendale nel tuo luogo.', 11),
('it', 'C1', 'food', 'La presentazione e il profilo del sapore dimostrano una tecnica culinaria sofisticata.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C1', 'accommodation', 'Ho assicurato una prenotazione tramite una piattaforma aggregatrice di viaggi online.', 1),
('it', 'C1', 'accommodation', 'Quali servizi e servizi premium sono disponibili nelle vostre suite esecutive?', 2),
('it', 'C1', 'accommodation', 'Vorrei richiedere alloggi con requisiti funzionali specifici.', 3),
('it', 'C1', 'accommodation', 'Potreste fornire informazioni sul vostro programma fedeltà e ricompense per gli ospiti?', 4),
('it', 'C1', 'accommodation', 'Devo modificare i parametri di prenotazione per accogliere circostanze mutevoli.', 5),
('it', 'C1', 'accommodation', 'Qual è il tuo quadro di politica riguardo al check-in anticipato e check-out tardivo?', 6),
('it', 'C1', 'accommodation', 'Vorrei organizzare servizi di concierge supplementari durante il mio soggiorno.', 7),
('it', 'C1', 'accommodation', 'Potreste raccomandare servizi e strutture orientati agli affari?', 8),
('it', 'C1', 'accommodation', 'Devo esaminare i termini e condizioni di cancellazione in dettaglio.', 9),
('it', 'C1', 'accommodation', 'Quali strutture per conferenze e riunioni avete disponibili per eventi aziendali?', 10),
('it', 'C1', 'accommodation', 'Vorrei fornire feedback dettagliato sulla mia esperienza come ospite.', 11),
('it', 'C1', 'accommodation', 'L''erogazione del servizio qui supera costantemente i benchmark del settore.', 12);

-- =====================================================
-- ITALIAN (it) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C2', 'greetings', 'Stavo aspettando con impazienza questa opportunità di stabilire una connessione professionale significativa.', 1),
('it', 'C2', 'greetings', 'È davvero un onore essere presentato a professionisti così compiuti e distinti.', 2),
('it', 'C2', 'greetings', 'Spero che possiamo coltivare una relazione professionale reciprocamente vantaggiosa e duratura.', 3),
('it', 'C2', 'greetings', 'Grazie per aver graziosamente accolto questo incontro nonostante il tuo programma estremamente impegnativo.', 4),
('it', 'C2', 'greetings', 'Apprezzo profondamente l''opportunità di partecipare a un dialogo sostanziale e intellettualmente stimolante.', 5),
('it', 'C2', 'greetings', 'Stabiliamo un quadro robusto per comunicazione sostenuta e collaborazione strategica.', 6),
('it', 'C2', 'greetings', 'Valuto altamente la sofisticazione e profondità delle nostre interazioni professionali.', 7),
('it', 'C2', 'greetings', 'È stato intellettualmente arricchente scambiare prospettive e intuizioni sfumate con te.', 8),
('it', 'C2', 'greetings', 'Non vedo l''ora di esplorare sinergie potenziali e opportunità di collaborazione tra le nostre organizzazioni.', 9),
('it', 'C2', 'greetings', 'Grazie per la tua ospitalità eccezionale e arrangiamenti meticolosamente premurosi.', 10),
('it', 'C2', 'greetings', 'Spero che possiamo riunirci di nuovo in circostanze ancora più propizie al discorso produttivo.', 11),
('it', 'C2', 'greetings', 'Sono profondamente grato per il tuo tempo prezioso e contributi professionali perspicaci.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C2', 'ordering', 'Sto conducendo una valutazione completa di questo acquisto nel contesto della nostra strategia di approvvigionamento più ampia.', 1),
('it', 'C2', 'ordering', 'Potresti fornire documentazione tecnica esaustiva e certificazioni di conformità per questo prodotto?', 2),
('it', 'C2', 'ordering', 'Vorrei impegnarmi in negoziazioni sofisticate riguardo ai termini commerciali e contrattuali.', 3),
('it', 'C2', 'ordering', 'Quali accordi di finanziamento strutturati e termini di pagamento avete disponibili per clienti aziendali?', 4),
('it', 'C2', 'ordering', 'Devo condurre una due diligence esaustiva e valutazione del rischio prima di finalizzare questa transazione.', 5),
('it', 'C2', 'ordering', 'Potresti proporre una struttura completa di sconto volume con prezzi a livelli per approvvigionamenti su larga scala?', 6),
('it', 'C2', 'ordering', 'Sono interessato al tuo pacchetto di servizio premium che include supporto e manutenzione completi.', 7),
('it', 'C2', 'ordering', 'Qual è il tuo quadro di garanzia qualità, copertura di garanzia e infrastruttura di supporto post-vendita?', 8),
('it', 'C2', 'ordering', 'Vorrei stabilire un accordo di pagamento flessibile che si adatti ai nostri cicli di pianificazione finanziaria.', 9),
('it', 'C2', 'ordering', 'Potresti generare una fattura commerciale dettagliata con ripartizione completa per voci e documentazione fiscale?', 10),
('it', 'C2', 'ordering', 'Devo avviare un processo di reso formale a causa del mancato rispetto dei requisiti tecnici specificati.', 11),
('it', 'C2', 'ordering', 'Qual è la tua garanzia completa di soddisfazione del cliente e meccanismo di risoluzione delle controversie?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C2', 'directions', 'Richiedo una guida di navigazione completa per ottimizzare il mio itinerario di viaggio minimizzando il tempo di transito e il costo.', 1),
('it', 'C2', 'directions', 'Potresti raccomandare rotte che offrono un equilibrio ottimale tra efficienza, valore panoramico e considerazioni di sicurezza?', 2),
('it', 'C2', 'directions', 'Sto monitorando modelli di traffico in tempo reale e dati storici per determinare la finestra di partenza più opportuna.', 3),
('it', 'C2', 'directions', 'Quali modalità di trasporto forniscono il rapporto affidabilità-costo più favorevole per questo viaggio particolare?', 4),
('it', 'C2', 'directions', 'Preferisco minimizzare le spese di pedaggio mantenendo una durata di viaggio ragionevole ed efficienza della rotta.', 5),
('it', 'C2', 'directions', 'Potresti raccomandare soluzioni di navigazione avanzate che integrano dati di traffico in tempo reale e analisi predittive?', 6),
('it', 'C2', 'directions', 'Devo coordinare un itinerario complesso multi-fermata con appuntamenti sensibili al tempo e vincoli logistici.', 7),
('it', 'C2', 'directions', 'Qual è la durata del viaggio proiettata considerando le condizioni di traffico attuali, potenziali ritardi e ottimizzazione della rotta?', 8),
('it', 'C2', 'directions', 'Apprezzerei informazioni complete su strategie di routing alternative e pianificazione di contingenza.', 9),
('it', 'C2', 'directions', 'Potresti fornire informazioni dettagliate sull''infrastruttura del parcheggio, disponibilità, prezzi e opzioni di prenotazione?', 10),
('it', 'C2', 'directions', 'Devo organizzare una logistica del trasporto sofisticata per una delegazione aziendale con requisiti specifici.', 11),
('it', 'C2', 'directions', 'Quali considerazioni di sicurezza, protezione e mitigazione del rischio dovrebbero informare la nostra strategia di selezione della rotta?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C2', 'food', 'Vorrei organizzare una prenotazione per un evento celebrativo significativo con requisiti e aspettative specifiche.', 1),
('it', 'C2', 'food', 'Potreste accogliere un gruppo sostanziale mantenendo una qualità del servizio eccezionale e attenzione ai dettagli?', 2),
('it', 'C2', 'food', 'Ho requisiti e preferenze dietetiche complesse che richiedono considerazione attenta e preparazione personalizzata.', 3),
('it', 'C2', 'food', 'Qual è l''impegno dell''establishment verso approvvigionamento sostenibile, pratiche etiche e responsabilità ambientale?', 4),
('it', 'C2', 'food', 'Vorrei consultare il tuo sommelier riguardo ad abbinamenti vino sofisticati che completano l''esperienza culinaria.', 5),
('it', 'C2', 'food', 'L''esperienza gastronomica qui dimostra un''arte culinaria eccezionale e combinazioni di sapori innovative.', 6),
('it', 'C2', 'food', 'Vorrei fornire feedback completo sugli standard di erogazione del servizio e l''esperienza complessiva di ristorazione.', 7),
('it', 'C2', 'food', 'Potremmo organizzare uno spazio da pranzo esclusivo che fornisce privacy e un''atmosfera migliorata per il nostro gruppo?', 8),
('it', 'C2', 'food', 'Sono interessato all''esperienza del menu degustazione dello chef che mostra l''intera gamma di capacità culinarie.', 9),
('it', 'C2', 'food', 'Qual è la tua politica riguardo al servizio di bevande esterne, tariffe di tappo e arrangiamenti per occasioni speciali?', 10),
('it', 'C2', 'food', 'Vorrei organizzare un evento di ospitalità aziendale nel tuo luogo con requisiti e aspettative specifiche.', 11),
('it', 'C2', 'food', 'La presentazione, il profilo del sapore e la tecnica culinaria dimostrano un''esperienza gastronomica sofisticata.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('it', 'C2', 'accommodation', 'Ho assicurato una prenotazione tramite una piattaforma aggregatrice di viaggi online e devo verificare i dettagli.', 1),
('it', 'C2', 'accommodation', 'Quali servizi premium, servizi personalizzati e strutture esclusive sono disponibili nelle vostre suite esecutive?', 2),
('it', 'C2', 'accommodation', 'Vorrei richiedere alloggi con requisiti funzionali specifici e considerazioni di accessibilità.', 3),
('it', 'C2', 'accommodation', 'Potreste fornire informazioni complete sul vostro programma fedeltà ospiti, struttura di ricompense e benefici di adesione?', 4),
('it', 'C2', 'accommodation', 'Devo modificare i parametri di prenotazione per accogliere circostanze mutevoli mantenendo termini favorevoli.', 5),
('it', 'C2', 'accommodation', 'Qual è il tuo quadro di politica riguardo al check-in anticipato, check-out tardivo e arrangiamenti di alloggio flessibili?', 6),
('it', 'C2', 'accommodation', 'Vorrei organizzare servizi di concierge supplementari e assistenza personalizzata durante il mio soggiorno prolungato.', 7),
('it', 'C2', 'accommodation', 'Potreste raccomandare servizi, strutture e servizi orientati agli affari per viaggiatori d''affari?', 8),
('it', 'C2', 'accommodation', 'Devo esaminare i termini di cancellazione, condizioni e implicazioni finanziarie potenziali in dettaglio completo.', 9),
('it', 'C2', 'accommodation', 'Quali strutture per conferenze, spazi per riunioni e capacità di eventi avete disponibili per funzioni aziendali?', 10),
('it', 'C2', 'accommodation', 'Vorrei fornire feedback dettagliato sulla mia esperienza come ospite e standard di erogazione del servizio.', 11),
('it', 'C2', 'accommodation', 'L''erogazione del servizio qui supera costantemente i benchmark del settore e dimostra standard di ospitalità eccezionali.', 12);

-- =====================================================
-- PORTUGUESE (pt) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'A2', 'greetings', 'Bom dia! Como você dormiu?', 1),
('pt', 'A2', 'greetings', 'É um prazer conhecê-lo.', 2),
('pt', 'A2', 'greetings', 'Como você tem estado ultimamente?', 3),
('pt', 'A2', 'greetings', 'Estou bem, obrigado por perguntar.', 4),
('pt', 'A2', 'greetings', 'O que o traz aqui hoje?', 5),
('pt', 'A2', 'greetings', 'Espero que possamos manter contato.', 6),
('pt', 'A2', 'greetings', 'Foi bom colocar as novidades em dia.', 7),
('pt', 'A2', 'greetings', 'Cuide-se e até logo!', 8),
('pt', 'A2', 'greetings', 'Estou ansioso para vê-lo novamente.', 9),
('pt', 'A2', 'greetings', 'Desejo-lhe um dia maravilhoso!', 10),
('pt', 'A2', 'greetings', 'Obrigado pelo seu tempo.', 11),
('pt', 'A2', 'greetings', 'Aprecio que você tenha reservado tempo para esta reunião.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'A2', 'ordering', 'Poderia ver o cardápio, por favor?', 1),
('pt', 'A2', 'ordering', 'O que você recomendaria?', 2),
('pt', 'A2', 'ordering', 'Gostaria de experimentar algo local.', 3),
('pt', 'A2', 'ordering', 'Há desconto para estudantes?', 4),
('pt', 'A2', 'ordering', 'Posso ter um recibo, por favor?', 5),
('pt', 'A2', 'ordering', 'Vocês oferecem embalagem para presente?', 6),
('pt', 'A2', 'ordering', 'Estou procurando algo específico.', 7),
('pt', 'A2', 'ordering', 'Você poderia me ajudar a encontrar este item?', 8),
('pt', 'A2', 'ordering', 'Qual é a sua política de devolução?', 9),
('pt', 'A2', 'ordering', 'Gostaria de trocar isto, por favor.', 10),
('pt', 'A2', 'ordering', 'Está disponível em outras cores?', 11),
('pt', 'A2', 'ordering', 'Posso pagar em parcelas?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'A2', 'directions', 'Você poderia me dizer como chegar ao museu?', 1),
('pt', 'A2', 'directions', 'Está a uma distância caminhável?', 2),
('pt', 'A2', 'directions', 'Quanto tempo durará a viagem?', 3),
('pt', 'A2', 'directions', 'De qual plataforma parte o trem?', 4),
('pt', 'A2', 'directions', 'Preciso trocar de trem?', 5),
('pt', 'A2', 'directions', 'Onde posso comprar uma passagem?', 6),
('pt', 'A2', 'directions', 'Há uma rota direta?', 7),
('pt', 'A2', 'directions', 'Você poderia me indicar a direção correta?', 8),
('pt', 'A2', 'directions', 'Acho que me perdi. Você pode me ajudar?', 9),
('pt', 'A2', 'directions', 'Qual é a melhor maneira de chegar lá?', 10),
('pt', 'A2', 'directions', 'Há estacionamento disponível nas proximidades?', 11),
('pt', 'A2', 'directions', 'Quanto custa um táxi para o aeroporto?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'A2', 'food', 'Poderíamos ter uma mesa perto da janela?', 1),
('pt', 'A2', 'food', 'Gostaria de fazer uma reserva para duas pessoas.', 2),
('pt', 'A2', 'food', 'Quais são os pratos do dia?', 3),
('pt', 'A2', 'food', 'Tenho uma alergia alimentar. Este prato é seguro?', 4),
('pt', 'A2', 'food', 'Poderia ter isto sem cebola?', 5),
('pt', 'A2', 'food', 'A comida aqui é excelente!', 6),
('pt', 'A2', 'food', 'Poderia ter a conta, por favor?', 7),
('pt', 'A2', 'food', 'A gorjeta está incluída na conta?', 8),
('pt', 'A2', 'food', 'Gostaria de pedir uma sobremesa.', 9),
('pt', 'A2', 'food', 'Poderia ter um copo de água?', 10),
('pt', 'A2', 'food', 'O que você recomenda para um vegetariano?', 11),
('pt', 'A2', 'food', 'O serviço aqui é muito bom.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'A2', 'accommodation', 'Fiz uma reserva online.', 1),
('pt', 'A2', 'accommodation', 'A que horas começa o café da manhã?', 2),
('pt', 'A2', 'accommodation', 'Poderia ter um quarto com vista?', 3),
('pt', 'A2', 'accommodation', 'Há academia ou piscina disponível?', 4),
('pt', 'A2', 'accommodation', 'O quarto é muito confortável.', 5),
('pt', 'A2', 'accommodation', 'Poderia ter travesseiros extras, por favor?', 6),
('pt', 'A2', 'accommodation', 'Gostaria de estender minha estadia.', 7),
('pt', 'A2', 'accommodation', 'Qual é a sua política de cancelamento?', 8),
('pt', 'A2', 'accommodation', 'Você poderia recomendar restaurantes nas proximidades?', 9),
('pt', 'A2', 'accommodation', 'Há um serviço de transporte para o aeroporto?', 10),
('pt', 'A2', 'accommodation', 'Preciso fazer o check-out cedo amanhã.', 11),
('pt', 'A2', 'accommodation', 'Poderia guardar minha bagagem após o check-out?', 12);

-- =====================================================
-- PORTUGUESE (pt) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B1', 'greetings', 'Faz um tempo desde a última vez que nos vimos.', 1),
('pt', 'B1', 'greetings', 'Gostaria de apresentar-lhe meu colega.', 2),
('pt', 'B1', 'greetings', 'Como tem sido o seu dia até agora?', 3),
('pt', 'B1', 'greetings', 'Espero que tudo esteja indo bem para você.', 4),
('pt', 'B1', 'greetings', 'É maravilhoso vê-lo novamente.', 5),
('pt', 'B1', 'greetings', 'Estava pensando em entrar em contato.', 6),
('pt', 'B1', 'greetings', 'Vamos manter contato mais regularmente.', 7),
('pt', 'B1', 'greetings', 'Aprecio que você tenha reservado tempo para esta reunião.', 8),
('pt', 'B1', 'greetings', 'Obrigado por vir com tão pouco aviso.', 9),
('pt', 'B1', 'greetings', 'Estou ansioso pela nossa futura colaboração.', 10),
('pt', 'B1', 'greetings', 'Foi um prazer passar tempo com você.', 11),
('pt', 'B1', 'greetings', 'Espero que possamos nos encontrar novamente em breve.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B1', 'ordering', 'Estou interessado em comprar este item.', 1),
('pt', 'B1', 'ordering', 'Você poderia fornecer mais informações sobre este produto?', 2),
('pt', 'B1', 'ordering', 'Qual é o período de garantia para isto?', 3),
('pt', 'B1', 'ordering', 'Gostaria de comparar diferentes opções.', 4),
('pt', 'B1', 'ordering', 'Vocês oferecem descontos promocionais?', 5),
('pt', 'B1', 'ordering', 'Poderia ver isto em outro tamanho?', 6),
('pt', 'B1', 'ordering', 'Estou procurando algo mais acessível.', 7),
('pt', 'B1', 'ordering', 'Quais métodos de pagamento vocês aceitam?', 8),
('pt', 'B1', 'ordering', 'Você poderia reservar este item para mim até amanhã?', 9),
('pt', 'B1', 'ordering', 'Gostaria de devolver esta compra.', 10),
('pt', 'B1', 'ordering', 'Qual é a sua política de troca?', 11),
('pt', 'B1', 'ordering', 'Poderia obter um recibo de presente para isto?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B1', 'directions', 'Preciso encontrar a rota mais rápida para o centro da cidade.', 1),
('pt', 'B1', 'directions', 'Você poderia explicar a melhor maneira de chegar lá?', 2),
('pt', 'B1', 'directions', 'Há transporte público disponível?', 3),
('pt', 'B1', 'directions', 'Quanto custaria aproximadamente um táxi?', 4),
('pt', 'B1', 'directions', 'Prefiro usar o metrô.', 5),
('pt', 'B1', 'directions', 'Você poderia me mostrar no mapa onde estamos?', 6),
('pt', 'B1', 'directions', 'Não estou familiarizado com esta área.', 7),
('pt', 'B1', 'directions', 'Quais pontos de referência devo procurar?', 8),
('pt', 'B1', 'directions', 'É seguro caminhar até lá a esta hora?', 9),
('pt', 'B1', 'directions', 'Você poderia recomendar um serviço de táxi confiável?', 10),
('pt', 'B1', 'directions', 'Preciso pegar um voo, então o tempo é importante.', 11),
('pt', 'B1', 'directions', 'Há fechamentos de estradas que eu deveria saber?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B1', 'food', 'Gostaria de fazer uma reserva para jantar neste fim de semana.', 1),
('pt', 'B1', 'food', 'Vocês têm opções vegetarianas no cardápio?', 2),
('pt', 'B1', 'food', 'Tenho restrições alimentares. Vocês podem acomodá-las?', 3),
('pt', 'B1', 'food', 'Qual é a recomendação do chef para hoje?', 4),
('pt', 'B1', 'food', 'Poderia ter este prato preparado sem laticínios?', 5),
('pt', 'B1', 'food', 'A apresentação da comida é impressionante.', 6),
('pt', 'B1', 'food', 'Gostaria de elogiar o chef por esta refeição.', 7),
('pt', 'B1', 'food', 'Poderíamos dividir a conta, por favor?', 8),
('pt', 'B1', 'food', 'Há uma taxa de serviço incluída?', 9),
('pt', 'B1', 'food', 'Gostaria de pedir uma garrafa de vinho.', 10),
('pt', 'B1', 'food', 'Você poderia recomendar um bom restaurante local?', 11),
('pt', 'B1', 'food', 'A atmosfera aqui é muito agradável.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B1', 'accommodation', 'Reservei um quarto através do seu site.', 1),
('pt', 'B1', 'accommodation', 'Quais comodidades estão incluídas no quarto?', 2),
('pt', 'B1', 'accommodation', 'Preferiria um quarto em um andar mais alto.', 3),
('pt', 'B1', 'accommodation', 'Há serviço de quarto disponível?', 4),
('pt', 'B1', 'accommodation', 'Poderia ter um check-out tardio, por favor?', 5),
('pt', 'B1', 'accommodation', 'Preciso cancelar minha reserva.', 6),
('pt', 'B1', 'accommodation', 'Qual é a sua política sobre animais de estimação?', 7),
('pt', 'B1', 'accommodation', 'Vocês poderiam organizar transporte para o aeroporto?', 8),
('pt', 'B1', 'accommodation', 'Gostaria de estender minha reserva por uma noite.', 9),
('pt', 'B1', 'accommodation', 'Há atrações turísticas nas proximidades?', 10),
('pt', 'B1', 'accommodation', 'Vocês poderiam fornecer um mapa da área local?', 11),
('pt', 'B1', 'accommodation', 'Estou muito satisfeito com o serviço aqui.', 12);

-- =====================================================
-- PORTUGUESE (pt) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B2', 'greetings', 'Estava esperando por esta reunião.', 1),
('pt', 'B2', 'greetings', 'É uma honra conhecê-lo.', 2),
('pt', 'B2', 'greetings', 'Espero que possamos estabelecer um relacionamento produtivo.', 3),
('pt', 'B2', 'greetings', 'Obrigado por reservar tempo da sua agenda lotada.', 4),
('pt', 'B2', 'greetings', 'Aprecio a oportunidade de me conectar com você.', 5),
('pt', 'B2', 'greetings', 'Vamos manter uma comunicação regular a partir de agora.', 6),
('pt', 'B2', 'greetings', 'Valorizo nosso relacionamento profissional.', 7),
('pt', 'B2', 'greetings', 'Foi um prazer discutir esta questão com você.', 8),
('pt', 'B2', 'greetings', 'Estou ansioso pela nossa colaboração contínua.', 9),
('pt', 'B2', 'greetings', 'Obrigado pela sua hospitalidade e calorosa recepção.', 10),
('pt', 'B2', 'greetings', 'Espero que possamos nos encontrar novamente em melhores circunstâncias.', 11),
('pt', 'B2', 'greetings', 'Sou grato pelo seu tempo e consideração.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B2', 'ordering', 'Estou considerando fazer uma compra significativa.', 1),
('pt', 'B2', 'ordering', 'Você poderia fornecer especificações detalhadas para este produto?', 2),
('pt', 'B2', 'ordering', 'Gostaria de negociar os termos desta transação.', 3),
('pt', 'B2', 'ordering', 'Quais são as opções de financiamento disponíveis?', 4),
('pt', 'B2', 'ordering', 'Preciso consultar alguém antes de tomar uma decisão.', 5),
('pt', 'B2', 'ordering', 'Você poderia oferecer um preço melhor para uma compra em grande quantidade?', 6),
('pt', 'B2', 'ordering', 'Estou interessado no seu pacote de serviço premium.', 7),
('pt', 'B2', 'ordering', 'Qual é a sua política em relação a defeitos do produto?', 8),
('pt', 'B2', 'ordering', 'Gostaria de organizar um plano de pagamento.', 9),
('pt', 'B2', 'ordering', 'Você poderia fornecer uma fatura detalhada para esta compra?', 10),
('pt', 'B2', 'ordering', 'Preciso devolver este item devido a um defeito de fabricação.', 11),
('pt', 'B2', 'ordering', 'Qual é a sua garantia de satisfação do cliente?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B2', 'directions', 'Preciso de instruções detalhadas para chegar ao meu destino de forma eficiente.', 1),
('pt', 'B2', 'directions', 'Você poderia sugerir a rota mais pitoresca?', 2),
('pt', 'B2', 'directions', 'Estou preocupado com as condições de tráfego neste momento.', 3),
('pt', 'B2', 'directions', 'Qual é o meio de transporte mais confiável?', 4),
('pt', 'B2', 'directions', 'Prefiro evitar estradas com pedágio, se possível.', 5),
('pt', 'B2', 'directions', 'Você poderia recomendar um aplicativo de navegação para esta área?', 6),
('pt', 'B2', 'directions', 'Preciso coordenar várias paradas na minha viagem.', 7),
('pt', 'B2', 'directions', 'Qual é o tempo de viagem estimado considerando as condições atuais?', 8),
('pt', 'B2', 'directions', 'Gostaria de saber sobre rotas alternativas.', 9),
('pt', 'B2', 'directions', 'Você poderia fornecer informações sobre instalações de estacionamento?', 10),
('pt', 'B2', 'directions', 'Preciso organizar transporte para um grupo.', 11),
('pt', 'B2', 'directions', 'Quais são as considerações de segurança para esta rota?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B2', 'food', 'Gostaria de fazer uma reserva para uma ocasião especial.', 1),
('pt', 'B2', 'food', 'Vocês poderiam acomodar um grupo de oito pessoas?', 2),
('pt', 'B2', 'food', 'Tenho requisitos dietéticos específicos que precisam ser considerados.', 3),
('pt', 'B2', 'food', 'Qual é a abordagem do restaurante em relação ao abastecimento sustentável?', 4),
('pt', 'B2', 'food', 'Gostaria de discutir as opções de harmonização de vinhos.', 5),
('pt', 'B2', 'food', 'A experiência culinária aqui é excepcional.', 6),
('pt', 'B2', 'food', 'Gostaria de fornecer feedback sobre a qualidade do serviço.', 7),
('pt', 'B2', 'food', 'Poderíamos organizar uma área de jantar privada?', 8),
('pt', 'B2', 'food', 'Estou interessado no menu degustação do chef.', 9),
('pt', 'B2', 'food', 'Qual é a sua política sobre trazer bebidas externas?', 10),
('pt', 'B2', 'food', 'Gostaria de organizar um jantar corporativo aqui.', 11),
('pt', 'B2', 'food', 'A combinação de apresentação e sabor é excepcional.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'B2', 'accommodation', 'Fiz uma reserva através de uma plataforma de reserva de terceiros.', 1),
('pt', 'B2', 'accommodation', 'Quais comodidades premium estão disponíveis em suas suítes?', 2),
('pt', 'B2', 'accommodation', 'Gostaria de solicitar um quarto com características específicas.', 3),
('pt', 'B2', 'accommodation', 'Vocês poderiam fornecer informações sobre seu programa de fidelidade?', 4),
('pt', 'B2', 'accommodation', 'Preciso modificar os detalhes da minha reserva.', 5),
('pt', 'B2', 'accommodation', 'Qual é a sua política em relação ao check-in antecipado?', 6),
('pt', 'B2', 'accommodation', 'Gostaria de organizar serviços adicionais durante minha estadia.', 7),
('pt', 'B2', 'accommodation', 'Vocês poderiam recomendar atividades para viajantes de negócios?', 8),
('pt', 'B2', 'accommodation', 'Preciso discutir os termos de cancelamento em detalhes.', 9),
('pt', 'B2', 'accommodation', 'Quais instalações de conferência vocês têm disponíveis?', 10),
('pt', 'B2', 'accommodation', 'Gostaria de fornecer feedback sobre minha experiência.', 11),
('pt', 'B2', 'accommodation', 'O nível de serviço aqui supera minhas expectativas.', 12);

-- =====================================================
-- PORTUGUESE (pt) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C1', 'greetings', 'Estava antecipando esta oportunidade de me conectar com você.', 1),
('pt', 'C1', 'greetings', 'É um privilégio ser apresentado a indivíduos tão distintos.', 2),
('pt', 'C1', 'greetings', 'Espero que possamos promover um relacionamento profissional mutuamente benéfico.', 3),
('pt', 'C1', 'greetings', 'Obrigado por acomodar esta reunião apesar da sua agenda exigente.', 4),
('pt', 'C1', 'greetings', 'Aprecio a oportunidade de participar de um diálogo significativo com você.', 5),
('pt', 'C1', 'greetings', 'Vamos estabelecer uma estrutura para comunicação e colaboração contínuas.', 6),
('pt', 'C1', 'greetings', 'Valorizo a profundidade e qualidade das nossas interações profissionais.', 7),
('pt', 'C1', 'greetings', 'Foi intelectualmente estimulante trocar perspectivas com você.', 8),
('pt', 'C1', 'greetings', 'Estou ansioso para explorar sinergias potenciais entre nossas organizações.', 9),
('pt', 'C1', 'greetings', 'Obrigado pela sua hospitalidade graciosa e arranjos considerados.', 10),
('pt', 'C1', 'greetings', 'Espero que possamos nos reunir novamente em circunstâncias mais favoráveis.', 11),
('pt', 'C1', 'greetings', 'Sou profundamente grato pelo seu tempo e insights profissionais.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C1', 'ordering', 'Estou avaliando esta compra como parte de uma estratégia de aquisição mais ampla.', 1),
('pt', 'C1', 'ordering', 'Você poderia fornecer documentação técnica abrangente para este produto?', 2),
('pt', 'C1', 'ordering', 'Gostaria de me envolver em negociações sobre os termos comerciais.', 3),
('pt', 'C1', 'ordering', 'Quais arranjos de financiamento estruturado vocês têm disponíveis?', 4),
('pt', 'C1', 'ordering', 'Preciso realizar uma due diligence antes de finalizar esta transação.', 5),
('pt', 'C1', 'ordering', 'Você poderia propor uma estrutura de desconto por volume para clientes corporativos?', 6),
('pt', 'C1', 'ordering', 'Estou interessado no seu pacote completo de serviço e suporte.', 7),
('pt', 'C1', 'ordering', 'Qual é a sua estrutura de garantia de qualidade e garantia?', 8),
('pt', 'C1', 'ordering', 'Gostaria de estabelecer um arranjo de pagamento flexível.', 9),
('pt', 'C1', 'ordering', 'Você poderia gerar uma fatura comercial detalhada com discriminação por item?', 10),
('pt', 'C1', 'ordering', 'Preciso iniciar um processo de devolução devido ao não cumprimento das especificações.', 11),
('pt', 'C1', 'ordering', 'Qual é o seu mecanismo de satisfação do cliente e resolução de disputas?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C1', 'directions', 'Requer orientação de navegação abrangente para otimizar meu itinerário de viagem.', 1),
('pt', 'C1', 'directions', 'Você poderia recomendar rotas que ofereçam tanto eficiência quanto valor panorâmico?', 2),
('pt', 'C1', 'directions', 'Estou monitorando padrões de tráfego para determinar horários de partida ótimos.', 3),
('pt', 'C1', 'directions', 'Quais opções de transporte oferecem a melhor relação confiabilidade-custo?', 4),
('pt', 'C1', 'directions', 'Prefiro minimizar despesas de pedágio mantendo um tempo de viagem razoável.', 5),
('pt', 'C1', 'directions', 'Você poderia recomendar soluções de navegação que integrem dados de tráfego em tempo real?', 6),
('pt', 'C1', 'directions', 'Preciso coordenar um itinerário de múltiplas paradas com compromissos sensíveis ao tempo.', 7),
('pt', 'C1', 'directions', 'Qual é a duração projetada da viagem considerando as condições de tráfego atuais?', 8),
('pt', 'C1', 'directions', 'Apreciaria informações sobre estratégias de roteamento alternativas.', 9),
('pt', 'C1', 'directions', 'Você poderia fornecer detalhes sobre infraestrutura e disponibilidade de estacionamento?', 10),
('pt', 'C1', 'directions', 'Preciso organizar logística de transporte para uma delegação corporativa.', 11),
('pt', 'C1', 'directions', 'Quais considerações de segurança e proteção devem informar a seleção de rota?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C1', 'food', 'Gostaria de organizar uma reserva para um evento comemorativo significativo.', 1),
('pt', 'C1', 'food', 'Vocês poderiam acomodar um grupo substancial mantendo a qualidade do serviço?', 2),
('pt', 'C1', 'food', 'Tenho requisitos dietéticos complexos que requerem consideração cuidadosa.', 3),
('pt', 'C1', 'food', 'Qual é o compromisso do estabelecimento com práticas de abastecimento sustentáveis e éticas?', 4),
('pt', 'C1', 'food', 'Gostaria de consultar seu sommelier sobre harmonizações de vinhos.', 5),
('pt', 'C1', 'food', 'A experiência gastronômica aqui demonstra arte culinária excepcional.', 6),
('pt', 'C1', 'food', 'Gostaria de fornecer feedback abrangente sobre padrões de prestação de serviço.', 7),
('pt', 'C1', 'food', 'Poderíamos organizar um espaço de jantar exclusivo para nosso grupo?', 8),
('pt', 'C1', 'food', 'Estou interessado em experimentar o menu degustação do chef.', 9),
('pt', 'C1', 'food', 'Qual é a sua política sobre serviço de bebidas externas e taxas de rolha?', 10),
('pt', 'C1', 'food', 'Gostaria de organizar um evento de hospitalidade corporativa em seu local.', 11),
('pt', 'C1', 'food', 'A apresentação e o perfil de sabor demonstram técnica culinária sofisticada.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C1', 'accommodation', 'Garanti uma reserva através de uma plataforma agregadora de viagens online.', 1),
('pt', 'C1', 'accommodation', 'Quais comodidades e serviços premium estão disponíveis em suas suítes executivas?', 2),
('pt', 'C1', 'accommodation', 'Gostaria de solicitar acomodações com requisitos funcionais específicos.', 3),
('pt', 'C1', 'accommodation', 'Vocês poderiam fornecer informações sobre seu programa de fidelidade e recompensas para hóspedes?', 4),
('pt', 'C1', 'accommodation', 'Preciso modificar parâmetros de reserva para acomodar circunstâncias mutáveis.', 5),
('pt', 'C1', 'accommodation', 'Qual é a sua estrutura de política em relação ao check-in antecipado e check-out tardio?', 6),
('pt', 'C1', 'accommodation', 'Gostaria de organizar serviços de concierge suplementares durante minha estadia.', 7),
('pt', 'C1', 'accommodation', 'Vocês poderiam recomendar comodidades e instalações focadas em negócios?', 8),
('pt', 'C1', 'accommodation', 'Preciso examinar termos e condições de cancelamento em detalhes.', 9),
('pt', 'C1', 'accommodation', 'Quais instalações de conferência e reunião vocês têm disponíveis para eventos corporativos?', 10),
('pt', 'C1', 'accommodation', 'Gostaria de fornecer feedback detalhado sobre minha experiência como hóspede.', 11),
('pt', 'C1', 'accommodation', 'A prestação de serviço aqui consistentemente supera os benchmarks da indústria.', 12);

-- =====================================================
-- PORTUGUESE (pt) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C2', 'greetings', 'Estava ansiosamente antecipando esta oportunidade de estabelecer uma conexão profissional significativa.', 1),
('pt', 'C2', 'greetings', 'É realmente uma honra ser apresentado a profissionais tão realizados e distintos.', 2),
('pt', 'C2', 'greetings', 'Espero que possamos cultivar um relacionamento profissional mutuamente vantajoso e duradouro.', 3),
('pt', 'C2', 'greetings', 'Obrigado por graciosamente acomodar esta reunião apesar da sua agenda extremamente exigente.', 4),
('pt', 'C2', 'greetings', 'Aprecio profundamente a oportunidade de participar de um diálogo substancial e intelectualmente estimulante.', 5),
('pt', 'C2', 'greetings', 'Vamos estabelecer uma estrutura robusta para comunicação sustentada e colaboração estratégica.', 6),
('pt', 'C2', 'greetings', 'Valorizo altamente a sofisticação e profundidade das nossas interações profissionais.', 7),
('pt', 'C2', 'greetings', 'Foi intelectualmente enriquecedor trocar perspectivas e insights matizados com você.', 8),
('pt', 'C2', 'greetings', 'Estou ansioso para explorar sinergias potenciais e oportunidades de colaboração entre nossas organizações.', 9),
('pt', 'C2', 'greetings', 'Obrigado pela sua hospitalidade excepcional e arranjos meticulosamente considerados.', 10),
('pt', 'C2', 'greetings', 'Espero que possamos nos reunir novamente em circunstâncias ainda mais propícias ao discurso produtivo.', 11),
('pt', 'C2', 'greetings', 'Sou profundamente grato pelo seu tempo valioso e contribuições profissionais perspicazes.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C2', 'ordering', 'Estou conduzindo uma avaliação abrangente desta compra no contexto da nossa estratégia de aquisição mais ampla.', 1),
('pt', 'C2', 'ordering', 'Você poderia fornecer documentação técnica exaustiva e certificações de conformidade para este produto?', 2),
('pt', 'C2', 'ordering', 'Gostaria de me envolver em negociações sofisticadas sobre os termos comerciais e contratuais.', 3),
('pt', 'C2', 'ordering', 'Quais arranjos de financiamento estruturado e termos de pagamento vocês têm disponíveis para clientes corporativos?', 4),
('pt', 'C2', 'ordering', 'Preciso realizar uma due diligence exaustiva e avaliação de riscos antes de finalizar esta transação.', 5),
('pt', 'C2', 'ordering', 'Você poderia propor uma estrutura abrangente de desconto por volume com precificação em camadas para aquisições em larga escala?', 6),
('pt', 'C2', 'ordering', 'Estou interessado no seu pacote de serviço premium que inclui suporte e manutenção abrangentes.', 7),
('pt', 'C2', 'ordering', 'Qual é a sua estrutura de garantia de qualidade, cobertura de garantia e infraestrutura de suporte pós-venda?', 8),
('pt', 'C2', 'ordering', 'Gostaria de estabelecer um arranjo de pagamento flexível que acomode nossos ciclos de planejamento financeiro.', 9),
('pt', 'C2', 'ordering', 'Você poderia gerar uma fatura comercial detalhada com discriminação abrangente por item e documentação fiscal?', 10),
('pt', 'C2', 'ordering', 'Preciso iniciar um processo de devolução formal devido ao não cumprimento dos requisitos técnicos especificados.', 11),
('pt', 'C2', 'ordering', 'Qual é a sua garantia abrangente de satisfação do cliente e mecanismo de resolução de disputas?', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C2', 'directions', 'Requer orientação de navegação abrangente para otimizar meu itinerário de viagem minimizando o tempo de trânsito e o custo.', 1),
('pt', 'C2', 'directions', 'Você poderia recomendar rotas que ofereçam um equilíbrio ótimo entre eficiência, valor panorâmico e considerações de segurança?', 2),
('pt', 'C2', 'directions', 'Estou monitorando padrões de tráfego em tempo real e dados históricos para determinar a janela de partida mais oportuna.', 3),
('pt', 'C2', 'directions', 'Quais modalidades de transporte oferecem a relação confiabilidade-custo mais favorável para esta viagem particular?', 4),
('pt', 'C2', 'directions', 'Prefiro minimizar despesas de pedágio mantendo uma duração de viagem razoável e eficiência de rota.', 5),
('pt', 'C2', 'directions', 'Você poderia recomendar soluções de navegação avançadas que integrem dados de tráfego em tempo real e análises preditivas?', 6),
('pt', 'C2', 'directions', 'Preciso coordenar um itinerário complexo de múltiplas paradas com compromissos sensíveis ao tempo e restrições logísticas.', 7),
('pt', 'C2', 'directions', 'Qual é a duração projetada da viagem considerando as condições de tráfego atuais, possíveis atrasos e otimização de rota?', 8),
('pt', 'C2', 'directions', 'Apreciaria informações abrangentes sobre estratégias de roteamento alternativas e planejamento de contingência.', 9),
('pt', 'C2', 'directions', 'Você poderia fornecer informações detalhadas sobre infraestrutura de estacionamento, disponibilidade, precificação e opções de reserva?', 10),
('pt', 'C2', 'directions', 'Preciso organizar logística de transporte sofisticada para uma delegação corporativa com requisitos específicos.', 11),
('pt', 'C2', 'directions', 'Quais considerações de segurança, proteção e mitigação de riscos devem informar nossa estratégia de seleção de rota?', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C2', 'food', 'Gostaria de organizar uma reserva para um evento comemorativo significativo com requisitos e expectativas específicas.', 1),
('pt', 'C2', 'food', 'Vocês poderiam acomodar um grupo substancial mantendo qualidade de serviço excepcional e atenção aos detalhes?', 2),
('pt', 'C2', 'food', 'Tenho requisitos e preferências dietéticas complexas que requerem consideração cuidadosa e preparação personalizada.', 3),
('pt', 'C2', 'food', 'Qual é o compromisso do estabelecimento com abastecimento sustentável, práticas éticas e responsabilidade ambiental?', 4),
('pt', 'C2', 'food', 'Gostaria de consultar seu sommelier sobre harmonizações de vinhos sofisticadas que complementam a experiência culinária.', 5),
('pt', 'C2', 'food', 'A experiência gastronômica aqui demonstra arte culinária excepcional e combinações de sabores inovadoras.', 6),
('pt', 'C2', 'food', 'Gostaria de fornecer feedback abrangente sobre padrões de prestação de serviço e experiência geral de jantar.', 7),
('pt', 'C2', 'food', 'Poderíamos organizar um espaço de jantar exclusivo que fornece privacidade e uma atmosfera aprimorada para nosso grupo?', 8),
('pt', 'C2', 'food', 'Estou interessado em experimentar o menu degustação do chef que mostra toda a gama de capacidades culinárias.', 9),
('pt', 'C2', 'food', 'Qual é a sua política sobre serviço de bebidas externas, taxas de rolha e arranjos para ocasiões especiais?', 10),
('pt', 'C2', 'food', 'Gostaria de organizar um evento de hospitalidade corporativa em seu local com requisitos e expectativas específicas.', 11),
('pt', 'C2', 'food', 'A apresentação, o perfil de sabor e a técnica culinária demonstram expertise gastronômica sofisticada.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('pt', 'C2', 'accommodation', 'Garanti uma reserva através de uma plataforma agregadora de viagens online e preciso verificar os detalhes.', 1),
('pt', 'C2', 'accommodation', 'Quais comodidades premium, serviços personalizados e instalações exclusivas estão disponíveis em suas suítes executivas?', 2),
('pt', 'C2', 'accommodation', 'Gostaria de solicitar acomodações com requisitos funcionais específicos e considerações de acessibilidade.', 3),
('pt', 'C2', 'accommodation', 'Vocês poderiam fornecer informações abrangentes sobre seu programa de fidelidade de hóspedes, estrutura de recompensas e benefícios de associação?', 4),
('pt', 'C2', 'accommodation', 'Preciso modificar parâmetros de reserva para acomodar circunstâncias mutáveis mantendo termos favoráveis.', 5),
('pt', 'C2', 'accommodation', 'Qual é a sua estrutura de política em relação ao check-in antecipado, check-out tardio e arranjos de acomodação flexíveis?', 6),
('pt', 'C2', 'accommodation', 'Gostaria de organizar serviços de concierge suplementares e assistência personalizada durante minha estadia prolongada.', 7),
('pt', 'C2', 'accommodation', 'Vocês poderiam recomendar comodidades, instalações e serviços focados em negócios para viajantes corporativos?', 8),
('pt', 'C2', 'accommodation', 'Preciso examinar termos de cancelamento, condições e implicações financeiras potenciais em detalhes abrangentes.', 9),
('pt', 'C2', 'accommodation', 'Quais instalações de conferência, espaços de reunião e capacidades de eventos vocês têm disponíveis para funções corporativas?', 10),
('pt', 'C2', 'accommodation', 'Gostaria de fornecer feedback detalhado sobre minha experiência como hóspede e padrões de prestação de serviço.', 11),
('pt', 'C2', 'accommodation', 'A prestação de serviço aqui consistentemente supera os benchmarks da indústria e demonstra padrões de hospitalidade excepcionais.', 12);

-- =====================================================
-- ARABIC (ar) - A2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'A2', 'greetings', 'صباح الخير! كيف نمت؟', 1),
('ar', 'A2', 'greetings', 'إنه لمن دواعي سروري أن ألتقي بك.', 2),
('ar', 'A2', 'greetings', 'كيف حالك مؤخراً؟', 3),
('ar', 'A2', 'greetings', 'أنا بخير، شكراً لسؤالك.', 4),
('ar', 'A2', 'greetings', 'ما الذي أتى بك هنا اليوم؟', 5),
('ar', 'A2', 'greetings', 'آمل أن نتمكن من البقاء على اتصال.', 6),
('ar', 'A2', 'greetings', 'كان من اللطيف أن نتبادل الأخبار.', 7),
('ar', 'A2', 'greetings', 'اعتن بنفسك وأراك قريباً!', 8),
('ar', 'A2', 'greetings', 'أتطلع إلى رؤيتك مرة أخرى.', 9),
('ar', 'A2', 'greetings', 'أتمنى لك يوماً رائعاً!', 10),
('ar', 'A2', 'greetings', 'شكراً لوقتك.', 11),
('ar', 'A2', 'greetings', 'أقدر أنك خصصت وقتاً لهذا الاجتماع.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'A2', 'ordering', 'هل يمكنني رؤية القائمة من فضلك؟', 1),
('ar', 'A2', 'ordering', 'ماذا تنصح؟', 2),
('ar', 'A2', 'ordering', 'أود أن أجرب شيئاً محلياً.', 3),
('ar', 'A2', 'ordering', 'هل يوجد خصم للطلاب؟', 4),
('ar', 'A2', 'ordering', 'هل يمكنني الحصول على إيصال من فضلك؟', 5),
('ar', 'A2', 'ordering', 'هل تقدمون تغليف الهدايا؟', 6),
('ar', 'A2', 'ordering', 'أبحث عن شيء محدد.', 7),
('ar', 'A2', 'ordering', 'هل يمكنك مساعدتي في العثور على هذا العنصر؟', 8),
('ar', 'A2', 'ordering', 'ما هي سياسة الإرجاع لديكم؟', 9),
('ar', 'A2', 'ordering', 'أود استبدال هذا من فضلك.', 10),
('ar', 'A2', 'ordering', 'هل هذا متوفر بألوان أخرى؟', 11),
('ar', 'A2', 'ordering', 'هل يمكنني الدفع على أقساط؟', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'A2', 'directions', 'هل يمكنك أن تخبرني كيف أصل إلى المتحف؟', 1),
('ar', 'A2', 'directions', 'هل هو على مسافة قريبة سيراً على الأقدام؟', 2),
('ar', 'A2', 'directions', 'كم ستستغرق الرحلة؟', 3),
('ar', 'A2', 'directions', 'من أي منصة يغادر القطار؟', 4),
('ar', 'A2', 'directions', 'هل أحتاج إلى تغيير القطار؟', 5),
('ar', 'A2', 'directions', 'أين يمكنني شراء تذكرة؟', 6),
('ar', 'A2', 'directions', 'هل يوجد طريق مباشر؟', 7),
('ar', 'A2', 'directions', 'هل يمكنك أن تشير لي إلى الاتجاه الصحيح؟', 8),
('ar', 'A2', 'directions', 'أعتقد أنني تاهت. هل يمكنك مساعدتي؟', 9),
('ar', 'A2', 'directions', 'ما هي أفضل طريقة للوصول إلى هناك؟', 10),
('ar', 'A2', 'directions', 'هل يوجد موقف سيارات متاح قريباً؟', 11),
('ar', 'A2', 'directions', 'كم يكلف التاكسي إلى المطار؟', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'A2', 'food', 'هل يمكننا الحصول على طاولة بجانب النافذة؟', 1),
('ar', 'A2', 'food', 'أود حجز طاولة لشخصين.', 2),
('ar', 'A2', 'food', 'ما هي أطباق اليوم؟', 3),
('ar', 'A2', 'food', 'لدي حساسية غذائية. هل هذا الطبق آمن؟', 4),
('ar', 'A2', 'food', 'هل يمكنني الحصول على هذا بدون بصل؟', 5),
('ar', 'A2', 'food', 'الطعام هنا ممتاز!', 6),
('ar', 'A2', 'food', 'هل يمكنني الحصول على الفاتورة من فضلك؟', 7),
('ar', 'A2', 'food', 'هل البقشيش مدرج في الفاتورة؟', 8),
('ar', 'A2', 'food', 'أود طلب الحلوى.', 9),
('ar', 'A2', 'food', 'هل يمكنني الحصول على كوب من الماء؟', 10),
('ar', 'A2', 'food', 'ماذا تنصح للنباتيين؟', 11),
('ar', 'A2', 'food', 'الخدمة هنا جيدة جداً.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'A2', 'accommodation', 'قمت بالحجز عبر الإنترنت.', 1),
('ar', 'A2', 'accommodation', 'في أي وقت يبدأ الإفطار؟', 2),
('ar', 'A2', 'accommodation', 'هل يمكنني الحصول على غرفة بإطلالة؟', 3),
('ar', 'A2', 'accommodation', 'هل يوجد صالة ألعاب رياضية أو مسبح متاح؟', 4),
('ar', 'A2', 'accommodation', 'الغرفة مريحة جداً.', 5),
('ar', 'A2', 'accommodation', 'هل يمكنني الحصول على وسائد إضافية من فضلك؟', 6),
('ar', 'A2', 'accommodation', 'أود تمديد إقامتي.', 7),
('ar', 'A2', 'accommodation', 'ما هي سياسة الإلغاء لديكم؟', 8),
('ar', 'A2', 'accommodation', 'هل يمكنك أن تنصحني بمطاعم قريبة؟', 9),
('ar', 'A2', 'accommodation', 'هل يوجد خدمة نقل إلى المطار؟', 10),
('ar', 'A2', 'accommodation', 'أحتاج إلى تسجيل الخروج مبكراً غداً.', 11),
('ar', 'A2', 'accommodation', 'هل يمكنني الاحتفاظ بأمتعتي بعد تسجيل الخروج؟', 12);

-- =====================================================
-- ARABIC (ar) - B1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B1', 'greetings', 'لقد مر بعض الوقت منذ آخر مرة التقينا فيها.', 1),
('ar', 'B1', 'greetings', 'أود أن أقدم لك زميلي.', 2),
('ar', 'B1', 'greetings', 'كيف كان يومك حتى الآن؟', 3),
('ar', 'B1', 'greetings', 'آمل أن كل شيء على ما يرام معك.', 4),
('ar', 'B1', 'greetings', 'من الرائع رؤيتك مرة أخرى.', 5),
('ar', 'B1', 'greetings', 'كنت أفكر في الاتصال بك.', 6),
('ar', 'B1', 'greetings', 'دعنا نبقى على اتصال بانتظام أكثر.', 7),
('ar', 'B1', 'greetings', 'أقدر أنك خصصت وقتاً لهذا الاجتماع.', 8),
('ar', 'B1', 'greetings', 'شكراً لك على الحضور بإشعار قصير جداً.', 9),
('ar', 'B1', 'greetings', 'أتطلع إلى تعاوننا المستقبلي.', 10),
('ar', 'B1', 'greetings', 'كان من دواعي سروري قضاء الوقت معك.', 11),
('ar', 'B1', 'greetings', 'آمل أن نتمكن من الاجتماع مرة أخرى قريباً.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B1', 'ordering', 'أنا مهتم بشراء هذا العنصر.', 1),
('ar', 'B1', 'ordering', 'هل يمكنك تقديم المزيد من المعلومات حول هذا المنتج؟', 2),
('ar', 'B1', 'ordering', 'ما هي فترة الضمان لهذا؟', 3),
('ar', 'B1', 'ordering', 'أود مقارنة خيارات مختلفة.', 4),
('ar', 'B1', 'ordering', 'هل تقدمون خصومات ترويجية؟', 5),
('ar', 'B1', 'ordering', 'هل يمكنني رؤية هذا بمقاس آخر؟', 6),
('ar', 'B1', 'ordering', 'أبحث عن شيء أكثر بأسعار معقولة.', 7),
('ar', 'B1', 'ordering', 'ما هي طرق الدفع التي تقبلونها؟', 8),
('ar', 'B1', 'ordering', 'هل يمكنك الاحتفاظ بهذا العنصر لي حتى الغد؟', 9),
('ar', 'B1', 'ordering', 'أود إرجاع هذه المشتريات.', 10),
('ar', 'B1', 'ordering', 'ما هي سياسة الاستبدال لديكم؟', 11),
('ar', 'B1', 'ordering', 'هل يمكنني الحصول على إيصال هدية لهذا؟', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B1', 'directions', 'أحتاج إلى العثور على أسرع طريق إلى وسط المدينة.', 1),
('ar', 'B1', 'directions', 'هل يمكنك شرح أفضل طريقة للوصول إلى هناك؟', 2),
('ar', 'B1', 'directions', 'هل يوجد نقل عام متاح؟', 3),
('ar', 'B1', 'directions', 'كم سيكلف التاكسي تقريباً؟', 4),
('ar', 'B1', 'directions', 'أفضل استخدام المترو.', 5),
('ar', 'B1', 'directions', 'هل يمكنك أن تريني على الخريطة أين نحن؟', 6),
('ar', 'B1', 'directions', 'أنا غير مألوف مع هذه المنطقة.', 7),
('ar', 'B1', 'directions', 'ما هي المعالم التي يجب أن أبحث عنها؟', 8),
('ar', 'B1', 'directions', 'هل من الآمن المشي إلى هناك في هذا الوقت؟', 9),
('ar', 'B1', 'directions', 'هل يمكنك أن تنصحني بخدمة تاكسي موثوقة؟', 10),
('ar', 'B1', 'directions', 'أحتاج إلى رحلة طيران، لذا الوقت مهم.', 11),
('ar', 'B1', 'directions', 'هل توجد إغلاقات للطرق يجب أن أعرفها؟', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B1', 'food', 'أود حجز طاولة للعشاء في نهاية هذا الأسبوع.', 1),
('ar', 'B1', 'food', 'هل لديكم خيارات نباتية في القائمة؟', 2),
('ar', 'B1', 'food', 'لدي قيود غذائية. هل يمكنكم استيعابها؟', 3),
('ar', 'B1', 'food', 'ما هي توصية الشيف لليوم؟', 4),
('ar', 'B1', 'food', 'هل يمكنني الحصول على هذا الطبق محضراً بدون منتجات ألبان؟', 5),
('ar', 'B1', 'food', 'عرض الطعام مثير للإعجاب.', 6),
('ar', 'B1', 'food', 'أود أن أهنئ الشيف على هذه الوجبة.', 7),
('ar', 'B1', 'food', 'هل يمكننا تقسيم الفاتورة من فضلك؟', 8),
('ar', 'B1', 'food', 'هل توجد رسوم خدمة مدرجة؟', 9),
('ar', 'B1', 'food', 'أود طلب زجاجة نبيذ.', 10),
('ar', 'B1', 'food', 'هل يمكنك أن تنصحني بمطعم محلي جيد؟', 11),
('ar', 'B1', 'food', 'الجو هنا لطيف جداً.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B1', 'accommodation', 'حجزت غرفة عبر موقعكم الإلكتروني.', 1),
('ar', 'B1', 'accommodation', 'ما هي المرافق المدرجة في الغرفة؟', 2),
('ar', 'B1', 'accommodation', 'أفضل غرفة في طابق أعلى.', 3),
('ar', 'B1', 'accommodation', 'هل يوجد خدمة الغرف متاحة؟', 4),
('ar', 'B1', 'accommodation', 'هل يمكنني الحصول على تسجيل خروج متأخر من فضلك؟', 5),
('ar', 'B1', 'accommodation', 'أحتاج إلى إلغاء حجزي.', 6),
('ar', 'B1', 'accommodation', 'ما هي سياستكم بشأن الحيوانات الأليفة؟', 7),
('ar', 'B1', 'accommodation', 'هل يمكنكم ترتيب نقل إلى المطار؟', 8),
('ar', 'B1', 'accommodation', 'أود تمديد حجزي لليلة واحدة.', 9),
('ar', 'B1', 'accommodation', 'هل توجد معالم سياحية قريبة؟', 10),
('ar', 'B1', 'accommodation', 'هل يمكنكم توفير خريطة للمنطقة المحلية؟', 11),
('ar', 'B1', 'accommodation', 'أنا راضٍ جداً عن الخدمة هنا.', 12);

-- =====================================================
-- ARABIC (ar) - B2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B2', 'greetings', 'كنت أتطلع إلى هذا الاجتماع.', 1),
('ar', 'B2', 'greetings', 'إنه لشرف أن أتعرف عليك.', 2),
('ar', 'B2', 'greetings', 'آمل أن نتمكن من إقامة علاقة مثمرة.', 3),
('ar', 'B2', 'greetings', 'شكراً لك على تخصيص الوقت من جدولك المزدحم.', 4),
('ar', 'B2', 'greetings', 'أقدر الفرصة للتواصل معك.', 5),
('ar', 'B2', 'greetings', 'دعنا نحافظ على اتصال منتظم من الآن فصاعداً.', 6),
('ar', 'B2', 'greetings', 'أقدر علاقتنا المهنية.', 7),
('ar', 'B2', 'greetings', 'كان من دواعي سروري مناقشة هذه المسألة معك.', 8),
('ar', 'B2', 'greetings', 'أتطلع إلى تعاوننا المستمر.', 9),
('ar', 'B2', 'greetings', 'شكراً لك على كرم الضيافة والترحيب الحار.', 10),
('ar', 'B2', 'greetings', 'آمل أن نتمكن من الاجتماع مرة أخرى في ظروف أفضل.', 11),
('ar', 'B2', 'greetings', 'أنا ممتن لوقتك وتفكيرك.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B2', 'ordering', 'أنا أفكر في إجراء شراء كبير.', 1),
('ar', 'B2', 'ordering', 'هل يمكنك تقديم مواصفات مفصلة لهذا المنتج؟', 2),
('ar', 'B2', 'ordering', 'أود التفاوض على شروط هذه المعاملة.', 3),
('ar', 'B2', 'ordering', 'ما هي خيارات التمويل المتاحة؟', 4),
('ar', 'B2', 'ordering', 'أحتاج إلى استشارة شخص ما قبل اتخاذ قرار.', 5),
('ar', 'B2', 'ordering', 'هل يمكنك تقديم سعر أفضل لشراء بالجملة؟', 6),
('ar', 'B2', 'ordering', 'أنا مهتم بحزمة الخدمة المميزة لديكم.', 7),
('ar', 'B2', 'ordering', 'ما هي سياستكم فيما يتعلق بعيوب المنتج؟', 8),
('ar', 'B2', 'ordering', 'أود ترتيب خطة دفع.', 9),
('ar', 'B2', 'ordering', 'هل يمكنك تقديم فاتورة مفصلة لهذه المشتريات؟', 10),
('ar', 'B2', 'ordering', 'أحتاج إلى إرجاع هذا العنصر بسبب عيب في التصنيع.', 11),
('ar', 'B2', 'ordering', 'ما هي ضمان رضا العملاء لديكم؟', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B2', 'directions', 'أحتاج إلى تعليمات مفصلة للوصول إلى وجهتي بكفاءة.', 1),
('ar', 'B2', 'directions', 'هل يمكنك اقتراح الطريق الأكثر جمالاً؟', 2),
('ar', 'B2', 'directions', 'أنا قلق بشأن ظروف المرور في هذا الوقت.', 3),
('ar', 'B2', 'directions', 'ما هي وسيلة النقل الأكثر موثوقية؟', 4),
('ar', 'B2', 'directions', 'أفضل تجنب الطرق المدفوعة إن أمكن.', 5),
('ar', 'B2', 'directions', 'هل يمكنك أن تنصحني بتطبيق ملاحة لهذه المنطقة؟', 6),
('ar', 'B2', 'directions', 'أحتاج إلى تنسيق عدة محطات في رحلتي.', 7),
('ar', 'B2', 'directions', 'ما هو وقت السفر المقدر مع الأخذ في الاعتبار الظروف الحالية؟', 8),
('ar', 'B2', 'directions', 'أود معرفة طرق بديلة.', 9),
('ar', 'B2', 'directions', 'هل يمكنك تقديم معلومات حول مرافق وقوف السيارات؟', 10),
('ar', 'B2', 'directions', 'أحتاج إلى ترتيب نقل لمجموعة.', 11),
('ar', 'B2', 'directions', 'ما هي اعتبارات السلامة لهذا الطريق؟', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B2', 'food', 'أود حجز طاولة لمناسبة خاصة.', 1),
('ar', 'B2', 'food', 'هل يمكنكم استيعاب مجموعة من ثمانية أشخاص؟', 2),
('ar', 'B2', 'food', 'لدي متطلبات غذائية محددة يجب أخذها في الاعتبار.', 3),
('ar', 'B2', 'food', 'ما هو نهج المطعم تجاه التوريد المستدام؟', 4),
('ar', 'B2', 'food', 'أود مناقشة خيارات تزاوج النبيذ.', 5),
('ar', 'B2', 'food', 'التجربة الطهوية هنا استثنائية.', 6),
('ar', 'B2', 'food', 'أود تقديم ملاحظات حول جودة الخدمة.', 7),
('ar', 'B2', 'food', 'هل يمكننا ترتيب منطقة طعام خاصة؟', 8),
('ar', 'B2', 'food', 'أنا مهتم بقائمة التذوق للشيف.', 9),
('ar', 'B2', 'food', 'ما هي سياستكم بشأن إحضار المشروبات الخارجية؟', 10),
('ar', 'B2', 'food', 'أود ترتيب عشاء شركاتي هنا.', 11),
('ar', 'B2', 'food', 'مزيج العرض والطعم استثنائي.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'B2', 'accommodation', 'قمت بالحجز عبر منصة حجز تابعة لطرف ثالث.', 1),
('ar', 'B2', 'accommodation', 'ما هي المرافق المميزة المتاحة في الأجنحة لديكم؟', 2),
('ar', 'B2', 'accommodation', 'أود طلب غرفة بخصائص محددة.', 3),
('ar', 'B2', 'accommodation', 'هل يمكنكم تقديم معلومات حول برنامج الولاء لديكم؟', 4),
('ar', 'B2', 'accommodation', 'أحتاج إلى تعديل تفاصيل حجزي.', 5),
('ar', 'B2', 'accommodation', 'ما هي سياستكم فيما يتعلق بتسجيل الوصول المبكر؟', 6),
('ar', 'B2', 'accommodation', 'أود ترتيب خدمات إضافية أثناء إقامتي.', 7),
('ar', 'B2', 'accommodation', 'هل يمكنكم أن تنصحوني بأنشطة للمسافرين رجال الأعمال؟', 8),
('ar', 'B2', 'accommodation', 'أحتاج إلى مناقشة شروط الإلغاء بالتفصيل.', 9),
('ar', 'B2', 'accommodation', 'ما هي مرافق المؤتمرات المتاحة لديكم؟', 10),
('ar', 'B2', 'accommodation', 'أود تقديم ملاحظات حول تجربتي.', 11),
('ar', 'B2', 'accommodation', 'مستوى الخدمة هنا يتجاوز توقعاتي.', 12);

-- =====================================================
-- ARABIC (ar) - C1 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C1', 'greetings', 'كنت أتوقع هذه الفرصة للتواصل معك.', 1),
('ar', 'C1', 'greetings', 'إنه لشرف أن أُقدم لأفراد متميزين كهؤلاء.', 2),
('ar', 'C1', 'greetings', 'آمل أن نتمكن من تعزيز علاقة مهنية مفيدة للطرفين.', 3),
('ar', 'C1', 'greetings', 'شكراً لك على استيعاب هذا الاجتماع رغم جدولك المزدحم.', 4),
('ar', 'C1', 'greetings', 'أقدر الفرصة للمشاركة في حوار ذي معنى معك.', 5),
('ar', 'C1', 'greetings', 'دعنا نؤسس إطاراً للتواصل والتعاون المستمرين.', 6),
('ar', 'C1', 'greetings', 'أقدر عمق وجودة تفاعلاتنا المهنية.', 7),
('ar', 'C1', 'greetings', 'كان من المحفز فكرياً تبادل وجهات النظر معك.', 8),
('ar', 'C1', 'greetings', 'أتطلع إلى استكشاف التآزر المحتمل بين منظماتنا.', 9),
('ar', 'C1', 'greetings', 'شكراً لك على كرم الضيافة والترتيبات المدروسة.', 10),
('ar', 'C1', 'greetings', 'آمل أن نتمكن من الاجتماع مرة أخرى في ظروف أكثر ملاءمة.', 11),
('ar', 'C1', 'greetings', 'أنا ممتن بشدة لوقتك ورؤاك المهنية.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C1', 'ordering', 'أنا أقيم هذا الشراء كجزء من استراتيجية شراء أوسع.', 1),
('ar', 'C1', 'ordering', 'هل يمكنك تقديم وثائق تقنية شاملة لهذا المنتج؟', 2),
('ar', 'C1', 'ordering', 'أود الانخراط في مفاوضات حول الشروط التجارية.', 3),
('ar', 'C1', 'ordering', 'ما هي ترتيبات التمويل المنظمة المتاحة لديكم؟', 4),
('ar', 'C1', 'ordering', 'أحتاج إلى إجراء العناية الواجبة قبل إنهاء هذه المعاملة.', 5),
('ar', 'C1', 'ordering', 'هل يمكنك اقتراح هيكل خصم بالحجم لعملاء الشركات؟', 6),
('ar', 'C1', 'ordering', 'أنا مهتم بحزمة الخدمة والدعم الشاملة لديكم.', 7),
('ar', 'C1', 'ordering', 'ما هو إطار ضمان الجودة والضمان لديكم؟', 8),
('ar', 'C1', 'ordering', 'أود إنشاء ترتيب دفع مرن.', 9),
('ar', 'C1', 'ordering', 'هل يمكنك إنشاء فاتورة تجارية مفصلة مع تفصيل حسب البند؟', 10),
('ar', 'C1', 'ordering', 'أحتاج إلى بدء عملية إرجاع بسبب عدم الامتثال للمواصفات.', 11),
('ar', 'C1', 'ordering', 'ما هي آلية رضا العملاء وحل النزاعات لديكم؟', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C1', 'directions', 'أحتاج إلى إرشادات ملاحة شاملة لتحسين مسار رحلتي.', 1),
('ar', 'C1', 'directions', 'هل يمكنك أن تنصحني بطرق تقدم كلاً من الكفاءة والقيمة البانورامية؟', 2),
('ar', 'C1', 'directions', 'أنا أراقب أنماط المرور لتحديد أوقات المغادرة المثلى.', 3),
('ar', 'C1', 'directions', 'ما هي خيارات النقل التي توفر أفضل نسبة موثوقية إلى التكلفة؟', 4),
('ar', 'C1', 'directions', 'أفضل تقليل نفقات الطرق المدفوعة مع الحفاظ على وقت سفر معقول.', 5),
('ar', 'C1', 'directions', 'هل يمكنك أن تنصحني بحلول ملاحة تدمج بيانات المرور في الوقت الفعلي؟', 6),
('ar', 'C1', 'directions', 'أحتاج إلى تنسيق مسار متعدد المحطات مع مواعيد حساسة للوقت.', 7),
('ar', 'C1', 'directions', 'ما هي مدة السفر المتوقعة مع الأخذ في الاعتبار ظروف المرور الحالية؟', 8),
('ar', 'C1', 'directions', 'سأقدر معلومات حول استراتيجيات التوجيه البديلة.', 9),
('ar', 'C1', 'directions', 'هل يمكنك تقديم تفاصيل حول البنية التحتية لوقوف السيارات والتوفر؟', 10),
('ar', 'C1', 'directions', 'أحتاج إلى ترتيب لوجستيات النقل لوفد شركاتي.', 11),
('ar', 'C1', 'directions', 'ما هي اعتبارات الأمان والحماية التي يجب أن توجه اختيار الطريق؟', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C1', 'food', 'أود ترتيب حجز لحدث احتفالي مهم.', 1),
('ar', 'C1', 'food', 'هل يمكنكم استيعاب مجموعة كبيرة مع الحفاظ على جودة الخدمة؟', 2),
('ar', 'C1', 'food', 'لدي متطلبات غذائية معقدة تتطلب اعتباراً دقيقاً.', 3),
('ar', 'C1', 'food', 'ما هو التزام المؤسسة بممارسات التوريد المستدامة والأخلاقية؟', 4),
('ar', 'C1', 'food', 'أود استشارة خبير النبيذ لديكم حول تزاوج النبيذ.', 5),
('ar', 'C1', 'food', 'التجربة الطهوية هنا تظهر فن طهي استثنائي.', 6),
('ar', 'C1', 'food', 'أود تقديم ملاحظات شاملة حول معايير تقديم الخدمة.', 7),
('ar', 'C1', 'food', 'هل يمكننا ترتيب منطقة طعام حصرية لمجموعتنا؟', 8),
('ar', 'C1', 'food', 'أنا مهتم بتجربة قائمة التذوق للشيف.', 9),
('ar', 'C1', 'food', 'ما هي سياستكم بشأن خدمة المشروبات الخارجية ورسوم الفلين؟', 10),
('ar', 'C1', 'food', 'أود ترتيب حدث ضيافة شركاتي في مكانكم.', 11),
('ar', 'C1', 'food', 'العرض وملف الطعم يظهران تقنية طهي متطورة.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C1', 'accommodation', 'أمنت حجزاً عبر منصة تجميع سفر عبر الإنترنت.', 1),
('ar', 'C1', 'accommodation', 'ما هي المرافق والخدمات المميزة المتاحة في الأجنحة التنفيذية لديكم؟', 2),
('ar', 'C1', 'accommodation', 'أود طلب أماكن إقامة بمتطلبات وظيفية محددة.', 3),
('ar', 'C1', 'accommodation', 'هل يمكنكم تقديم معلومات حول برنامج الولاء والمكافآت للضيوف لديكم؟', 4),
('ar', 'C1', 'accommodation', 'أحتاج إلى تعديل معاملات الحجز لاستيعاب ظروف متغيرة.', 5),
('ar', 'C1', 'accommodation', 'ما هو إطار السياسة لديكم فيما يتعلق بتسجيل الوصول المبكر وتسجيل الخروج المتأخر؟', 6),
('ar', 'C1', 'accommodation', 'أود ترتيب خدمات الكونسيرج الإضافية أثناء إقامتي.', 7),
('ar', 'C1', 'accommodation', 'هل يمكنكم أن تنصحوني بمرافق ومرافق تركز على الأعمال؟', 8),
('ar', 'C1', 'accommodation', 'أحتاج إلى مراجعة شروط وأحكام الإلغاء بالتفصيل.', 9),
('ar', 'C1', 'accommodation', 'ما هي مرافق المؤتمرات والاجتماعات المتاحة لديكم للأحداث الشركاتية؟', 10),
('ar', 'C1', 'accommodation', 'أود تقديم ملاحظات مفصلة حول تجربتي كضيف.', 11),
('ar', 'C1', 'accommodation', 'تقديم الخدمة هنا يتجاوز باستمرار معايير الصناعة.', 12);

-- =====================================================
-- ARABIC (ar) - C2 Level
-- =====================================================

-- Topic 1: Greetings & Introductions
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C2', 'greetings', 'كنت أتطلع بفارغ الصبر إلى هذه الفرصة لإقامة اتصال مهني ذي معنى.', 1),
('ar', 'C2', 'greetings', 'إنه حقاً لشرف أن أُقدم لمهنيين متميزين ومحترمين كهؤلاء.', 2),
('ar', 'C2', 'greetings', 'آمل أن نتمكن من تنمية علاقة مهنية مفيدة للطرفين ودائمة.', 3),
('ar', 'C2', 'greetings', 'شكراً لك على استيعاب هذا الاجتماع بلطف رغم جدولك المزدحم للغاية.', 4),
('ar', 'C2', 'greetings', 'أقدر بشدة الفرصة للمشاركة في حوار جوهري ومحفز فكرياً.', 5),
('ar', 'C2', 'greetings', 'دعنا نؤسس إطاراً قوياً للتواصل المستدام والتعاون الاستراتيجي.', 6),
('ar', 'C2', 'greetings', 'أقدر بشدة التطور والعمق في تفاعلاتنا المهنية.', 7),
('ar', 'C2', 'greetings', 'كان من المثر فكرياً تبادل وجهات النظر والرؤى الدقيقة معك.', 8),
('ar', 'C2', 'greetings', 'أتطلع إلى استكشاف التآزر المحتمل وفرص التعاون بين منظماتنا.', 9),
('ar', 'C2', 'greetings', 'شكراً لك على كرم الضيافة الاستثنائي والترتيبات المدروسة بدقة.', 10),
('ar', 'C2', 'greetings', 'آمل أن نتمكن من الاجتماع مرة أخرى في ظروف أكثر ملاءمة للخطاب المنتج.', 11),
('ar', 'C2', 'greetings', 'أنا ممتن بشدة لوقتك الثمين ومساهماتك المهنية الثاقبة.', 12);

-- Topic 2: Ordering & Shopping
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C2', 'ordering', 'أنا أُجري تقييماً شاملاً لهذا الشراء في سياق استراتيجية شراءنا الأوسع.', 1),
('ar', 'C2', 'ordering', 'هل يمكنك تقديم وثائق تقنية شاملة وشهادات الامتثال لهذا المنتج؟', 2),
('ar', 'C2', 'ordering', 'أود الانخراط في مفاوضات متطورة حول الشروط التجارية والتعاقدية.', 3),
('ar', 'C2', 'ordering', 'ما هي ترتيبات التمويل المنظمة وشروط الدفع المتاحة لديكم لعملاء الشركات؟', 4),
('ar', 'C2', 'ordering', 'أحتاج إلى إجراء العناية الواجبة الشاملة وتقييم المخاطر قبل إنهاء هذه المعاملة.', 5),
('ar', 'C2', 'ordering', 'هل يمكنك اقتراح هيكل خصم بالحجم الشامل مع تسعير متدرج للشراء على نطاق واسع؟', 6),
('ar', 'C2', 'ordering', 'أنا مهتم بحزمة الخدمة المميزة لديكم التي تشمل الدعم والصيانة الشاملين.', 7),
('ar', 'C2', 'ordering', 'ما هو إطار ضمان الجودة لديكم، وتغطية الضمان، والبنية التحتية لدعم ما بعد البيع؟', 8),
('ar', 'C2', 'ordering', 'أود إنشاء ترتيب دفع مرن يتكيف مع دورات تخطيطنا المالي.', 9),
('ar', 'C2', 'ordering', 'هل يمكنك إنشاء فاتورة تجارية مفصلة مع تفصيل شامل حسب البند والوثائق الضريبية؟', 10),
('ar', 'C2', 'ordering', 'أحتاج إلى بدء عملية إرجاع رسمية بسبب عدم الامتثال للمتطلبات التقنية المحددة.', 11),
('ar', 'C2', 'ordering', 'ما هي ضمان رضا العملاء الشامل وآلية حل النزاعات لديكم؟', 12);

-- Topic 3: Directions & Transportation
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C2', 'directions', 'أحتاج إلى إرشادات ملاحة شاملة لتحسين مسار رحلتي مع تقليل وقت العبور والتكلفة.', 1),
('ar', 'C2', 'directions', 'هل يمكنك أن تنصحني بطرق تقدم توازناً مثالياً بين الكفاءة والقيمة البانورامية واعتبارات السلامة؟', 2),
('ar', 'C2', 'directions', 'أنا أراقب أنماط المرور في الوقت الفعلي والبيانات التاريخية لتحديد نافذة المغادرة الأكثر ملاءمة.', 3),
('ar', 'C2', 'directions', 'ما هي وسائل النقل التي توفر نسبة موثوقية إلى التكلفة الأكثر ملاءمة لهذه الرحلة المحددة؟', 4),
('ar', 'C2', 'directions', 'أفضل تقليل نفقات الطرق المدفوعة مع الحفاظ على مدة سفر معقولة وكفاءة الطريق.', 5),
('ar', 'C2', 'directions', 'هل يمكنك أن تنصحني بحلول ملاحة متقدمة تدمج بيانات المرور في الوقت الفعلي والتحليلات التنبؤية؟', 6),
('ar', 'C2', 'directions', 'أحتاج إلى تنسيق مسار معقد متعدد المحطات مع مواعيد حساسة للوقت وقيود لوجستية.', 7),
('ar', 'C2', 'directions', 'ما هي مدة السفر المتوقعة مع الأخذ في الاعتبار ظروف المرور الحالية، والتأخيرات المحتملة، وتحسين الطريق؟', 8),
('ar', 'C2', 'directions', 'سأقدر معلومات شاملة حول استراتيجيات التوجيه البديلة وتخطيط الطوارئ.', 9),
('ar', 'C2', 'directions', 'هل يمكنك تقديم معلومات مفصلة حول البنية التحتية لوقوف السيارات، والتوفر، والتسعير، وخيارات الحجز؟', 10),
('ar', 'C2', 'directions', 'أحتاج إلى ترتيب لوجستيات نقل متطورة لوفد شركاتي بمتطلبات محددة.', 11),
('ar', 'C2', 'directions', 'ما هي اعتبارات السلامة والحماية والتخفيف من المخاطر التي يجب أن توجه استراتيجية اختيار الطريق لدينا؟', 12);

-- Topic 4: Food & Dining
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C2', 'food', 'أود ترتيب حجز لحدث احتفالي مهم بمتطلبات وتوقعات محددة.', 1),
('ar', 'C2', 'food', 'هل يمكنكم استيعاب مجموعة كبيرة مع الحفاظ على جودة خدمة استثنائية والانتباه للتفاصيل؟', 2),
('ar', 'C2', 'food', 'لدي متطلبات وتفضيلات غذائية معقدة تتطلب اعتباراً دقيقاً وإعداداً مخصصاً.', 3),
('ar', 'C2', 'food', 'ما هو التزام المؤسسة بالتوريد المستدام، والممارسات الأخلاقية، والمسؤولية البيئية؟', 4),
('ar', 'C2', 'food', 'أود استشارة خبير النبيذ لديكم حول تزاوج النبيذ المتطور الذي يكمل التجربة الطهوية.', 5),
('ar', 'C2', 'food', 'التجربة الطهوية هنا تظهر فن طهي استثنائي وتركيبات نكهة مبتكرة.', 6),
('ar', 'C2', 'food', 'أود تقديم ملاحظات شاملة حول معايير تقديم الخدمة وتجربة الطعام العامة.', 7),
('ar', 'C2', 'food', 'هل يمكننا ترتيب منطقة طعام حصرية توفر الخصوصية وجواً محسناً لمجموعتنا؟', 8),
('ar', 'C2', 'food', 'أنا مهتم بتجربة قائمة التذوق للشيف التي تُظهر النطاق الكامل للقدرات الطهوية.', 9),
('ar', 'C2', 'food', 'ما هي سياستكم بشأن خدمة المشروبات الخارجية، ورسوم الفلين، والترتيبات للمناسبات الخاصة؟', 10),
('ar', 'C2', 'food', 'أود ترتيب حدث ضيافة شركاتي في مكانكم بمتطلبات وتوقعات محددة.', 11),
('ar', 'C2', 'food', 'العرض، وملف الطعم، والتقنية الطهوية تظهر خبرة طهوية متطورة.', 12);

-- Topic 5: Accommodation & Travel
INSERT INTO practice_sentences (language_code, level, topic, sentence, "order") VALUES
('ar', 'C2', 'accommodation', 'أمنت حجزاً عبر منصة تجميع سفر عبر الإنترنت وأحتاج إلى التحقق من التفاصيل.', 1),
('ar', 'C2', 'accommodation', 'ما هي المرافق المميزة، والخدمات المخصصة، والمرافق الحصرية المتاحة في الأجنحة التنفيذية لديكم؟', 2),
('ar', 'C2', 'accommodation', 'أود طلب أماكن إقامة بمتطلبات وظيفية محددة واعتبارات إمكانية الوصول.', 3),
('ar', 'C2', 'accommodation', 'هل يمكنكم تقديم معلومات شاملة حول برنامج ولاء الضيوف لديكم، وهيكل المكافآت، وفوائد العضوية؟', 4),
('ar', 'C2', 'accommodation', 'أحتاج إلى تعديل معاملات الحجز لاستيعاب ظروف متغيرة مع الحفاظ على شروط مواتية.', 5),
('ar', 'C2', 'accommodation', 'ما هو إطار السياسة لديكم فيما يتعلق بتسجيل الوصول المبكر، وتسجيل الخروج المتأخر، وترتيبات الإقامة المرنة؟', 6),
('ar', 'C2', 'accommodation', 'أود ترتيب خدمات الكونسيرج الإضافية والمساعدة المخصصة أثناء إقامتي الممتدة.', 7),
('ar', 'C2', 'accommodation', 'هل يمكنكم أن تنصحوني بمرافق ومرافق وخدمات تركز على الأعمال للمسافرين رجال الأعمال؟', 8),
('ar', 'C2', 'accommodation', 'أحتاج إلى مراجعة شروط الإلغاء، والأحكام، والآثار المالية المحتملة بالتفصيل الشامل.', 9),
('ar', 'C2', 'accommodation', 'ما هي مرافق المؤتمرات، ومساحات الاجتماعات، وقدرات الأحداث المتاحة لديكم للوظائف الشركاتية؟', 10),
('ar', 'C2', 'accommodation', 'أود تقديم ملاحظات مفصلة حول تجربتي كضيف ومعايير تقديم الخدمة.', 11),
('ar', 'C2', 'accommodation', 'تقديم الخدمة هنا يتجاوز باستمرار معايير الصناعة ويظهر معايير ضيافة استثنائية.', 12);

-- =====================================================
-- TAMAMLANDI!
-- =====================================================
-- Tüm desteklenen diller (en, tr, es, de, fr, it, pt, ar) için
-- tüm seviyeler (A2, B1, B2, C1, C2) başarıyla eklendi.
-- Her dil için 5 topic (greetings, ordering, directions, food, accommodation)
-- Her topic için 12 cümle
-- Toplam: 8 dil × 5 seviye × 5 topic × 12 cümle = 2,400 cümle
-- =====================================================

