# Clear existing data
puts "Clearing existing data..."
SentenceBank.destroy_all

# Seed sentences for each level
puts "Seeding sentences..."

sentences_data = {
  'A1' => {
    'en' => [
      'Hello, my name is John.',
      'I like coffee.',
      'This is my friend.',
      'Where is the library?',
      'Good morning!',
      'How are you?',
      'I am fine, thank you.',
      'What is your name?',
      'Nice to meet you.',
      'See you later.',
      'I live in London.',
      'I am from Spain.',
      'I have a cat.',
      'She is my sister.',
      'He is a teacher.',
      'This is a book.',
      'I want water, please.',
      'How much is this?',
      'Where is the bathroom?',
      'I don\'t understand.'
    ],
    'tr' => [
      'Merhaba, benim adım John.',
      'Kahve severim.',
      'Bu benim arkadaşım.',
      'Kütüphane nerede?',
      'Günaydın!',
      'Nasılsın?',
      'İyiyim, teşekkürler.',
      'Adın ne?',
      'Tanıştığımıza memnun oldum.',
      'Görüşürüz.',
    ]
  },
  'A2' => {
    'en' => [
      'I would like a cup of coffee, please.',
      'Can you help me find the train station?',
      'What time does the meeting start?',
      'I enjoy reading books in my free time.',
      'The weather is beautiful today.',
      'I went to the cinema yesterday.',
      'She doesn\'t like spicy food.',
      'We are planning to visit Paris next month.',
      'Could you speak more slowly, please?',
      'I have been studying English for two years.',
      'My brother is taller than me.',
      'The restaurant is next to the bank.',
      'I usually wake up at seven o\'clock.',
      'They are going to the beach tomorrow.',
      'I need to buy some groceries.',
      'She works in a hospital.',
      'We had a great time at the party.',
      'I can\'t find my keys anywhere.',
      'He loves playing football.',
      'The movie was really interesting.'
    ]
  },
  'B1' => {
    'en' => [
      'I have been learning English for three years.',
      'Could you explain that concept in more detail?',
      'I am looking forward to visiting your country.',
      'In my opinion, technology has changed our lives significantly.',
      'I would appreciate it if you could help me with this task.',
      'Despite the bad weather, we decided to go hiking.',
      'She succeeded in passing the exam.',
      'I regret not studying harder when I was younger.',
      'The book that I bought yesterday is fascinating.',
      'If I had more time, I would travel around the world.',
      'He has been working here since 2010.',
      'I\'m not used to waking up so early.',
      'The company is planning to expand internationally.',
      'We should have left earlier to avoid the traffic.',
      'She might be late because of the train delay.',
      'I\'ve never been to Australia before.',
      'They were surprised by the unexpected news.',
      'It\'s important to maintain a healthy lifestyle.',
      'The project will be completed by the end of the month.',
      'I wish I could speak more languages.'
    ]
  },
  'B2' => {
    'en' => [
      'The ongoing debate about climate change requires immediate attention.',
      'I have always been passionate about environmental conservation.',
      'It is essential to consider multiple perspectives before making a decision.',
      'The company has implemented several innovative strategies this year.',
      'Understanding cultural differences is crucial in global business.',
      'The research findings suggest a strong correlation between these factors.',
      'She has a remarkable ability to adapt to challenging situations.',
      'The government\'s new policy has sparked considerable controversy.',
      'His presentation was both informative and engaging.',
      'We need to address these issues systematically.',
      'The economic downturn has affected numerous industries.',
      'I was impressed by her analytical approach to the problem.',
      'The museum exhibition provides valuable insights into ancient civilizations.',
      'Technology has revolutionized the way we communicate.',
      'They have been collaborating on this project for several months.',
      'The implications of this discovery are far-reaching.',
      'She demonstrated exceptional leadership qualities.',
      'The situation requires careful consideration and strategic planning.',
      'His argument was well-structured and convincing.',
      'We must take into account various factors when evaluating this proposal.'
    ]
  },
  'C1' => {
    'en' => [
      'The complexity of the situation necessitates a comprehensive approach.',
      'Her eloquent presentation captivated the entire audience.',
      'The ramifications of this policy extend far beyond initial expectations.',
      'His nuanced understanding of the subject matter was evident throughout the discussion.',
      'The paradigm shift in contemporary education demands innovative methodologies.',
      'The symposium fostered meaningful dialogue among distinguished scholars.',
      'Her research methodology exemplifies rigorous academic standards.',
      'The intricate relationship between these variables warrants further investigation.',
      'He articulated his position with remarkable clarity and precision.',
      'The theoretical framework underpinning this study is well-established.',
      'Her contributions to the field have been groundbreaking and influential.',
      'The multifaceted nature of the problem requires interdisciplinary collaboration.',
      'His critique was incisive yet constructive.',
      'The implementation of these recommendations would yield significant benefits.',
      'She possesses an exceptional command of the subject matter.',
      'The prevailing consensus among experts supports this hypothesis.',
      'His analysis revealed previously overlooked dimensions of the issue.',
      'The discourse surrounding this topic has become increasingly sophisticated.',
      'Her innovative approach challenged conventional wisdom.',
      'The convergence of these factors has created unprecedented opportunities.'
    ]
  },
  'C2' => {
    'en' => [
      'The quintessential manifestation of postmodern literature exemplifies linguistic virtuosity.',
      'Epistemological considerations underpin the fundamental premises of empirical research.',
      'The juxtaposition of divergent theoretical frameworks elucidates intricate conceptual relationships.',
      'Her erudite discourse on phenomenology transcended conventional academic boundaries.',
      'The multifaceted implications of globalization permeate every stratum of contemporary society.',
      'The dialectical approach to historiography reveals inherent contradictions in prevailing narratives.',
      'His scholarly endeavors have significantly advanced the frontiers of theoretical physics.',
      'The intertextual references in her work demonstrate profound literary sophistication.',
      'The epistemological foundations of scientific inquiry remain subject to philosophical scrutiny.',
      'Her magnum opus represents a seminal contribution to critical theory.',
      'The hermeneutic interpretation of cultural artifacts necessitates contextual awareness.',
      'His incisive deconstruction of hegemonic discourses challenged entrenched orthodoxies.',
      'The phenomenological investigation of consciousness yields profound insights into human existence.',
      'The ontological implications of quantum mechanics continue to perplex theoretical physicists.',
      'Her perspicacious analysis illuminated previously obscure aspects of the phenomenon.',
      'The axiological dimensions of ethical philosophy warrant rigorous examination.',
      'His propensity for dialectical reasoning enabled penetrating critique of ideological constructs.',
      'The paradigmatic shift in scientific understanding revolutionized established methodologies.',
      'Her comprehensive synthesis of disparate theories demonstrated remarkable intellectual acuity.',
      'The inexorable march of technological advancement poses unprecedented existential questions.'
    ]
  }
}

sentences_data.each do |level, languages|
  languages.each do |language, sentences|
    sentences.each do |text|
      SentenceBank.create!(
        level: level,
        language: language,
        text: text
      )
      print '.'
    end
  end
end

puts "\n✅ Seeding completed!"
puts "Total sentences: #{SentenceBank.count}"

# Print summary
puts "\nSummary by level:"
%w[A1 A2 B1 B2 C1 C2].each do |level|
  count = SentenceBank.where(level: level).count
  puts "  #{level}: #{count} sentences"
end

