-- ===================================
-- SENTENCE TRANSLATIONS - MANUAL INSERT
-- ===================================
-- Bu SQL komutlarını Supabase Dashboard > SQL Editor'da çalıştırın
-- Tüm desteklenen diller için A1-C2 seviyelerindeki cümleler
-- NOT: İngilizce cümleler zaten veritabanında kayıtlı, bu yüzden eklenmedi

-- ====================
-- TURKISH (tr)
-- ====================

-- A1 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'tr', 'Merhaba, benim adım John.'),
('A1', 'tr', 'Kahve severim.'),
('A1', 'tr', 'Bu benim arkadaşım.'),
('A1', 'tr', 'Kütüphane nerede?'),
('A1', 'tr', 'Günaydın!'),
('A1', 'tr', 'Nasılsın?'),
('A1', 'tr', 'İyiyim, teşekkür ederim.'),
('A1', 'tr', 'Adın ne?'),
('A1', 'tr', 'Memnun oldum.'),
('A1', 'tr', 'Sonra görüşürüz.');

-- A2 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'tr', 'Bir fincan kahve istiyorum lütfen.'),
('A2', 'tr', 'Tren istasyonunu bulmama yardım edebilir misiniz?'),
('A2', 'tr', 'Toplantı saat kaçta başlıyor?'),
('A2', 'tr', 'Boş zamanlarımda kitap okumaktan hoşlanırım.'),
('A2', 'tr', 'Bugün hava çok güzel.'),
('A2', 'tr', 'Dün sinemaya gittim.'),
('A2', 'tr', 'Daha yavaş konuşabilir misiniz lütfen?'),
('A2', 'tr', 'Genellikle saat yedide uyanırım.'),
('A2', 'tr', 'Biraz market alışverişi yapmam gerekiyor.'),
('A2', 'tr', 'Film gerçekten ilginçti.');

-- B1 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'tr', 'Üç yıldır İngilizce öğreniyorum.'),
('B1', 'tr', 'Bu konsepti daha detaylı açıklayabilir misiniz?'),
('B1', 'tr', 'Ülkenizi ziyaret etmeyi dört gözle bekliyorum.'),
('B1', 'tr', 'Bence teknoloji hayatımızı önemli ölçüde değiştirdi.'),
('B1', 'tr', 'Bu görevde bana yardım ederseniz çok memnun olurum.'),
('B1', 'tr', 'Kötü havaya rağmen yürüyüşe gitmeye karar verdik.'),
('B1', 'tr', 'Dün aldığım kitap büyüleyici.'),
('B1', 'tr', 'Daha fazla zamanım olsaydı, dünyayı dolaşırdım.'),
('B1', 'tr', 'Sağlıklı bir yaşam tarzı sürdürmek önemlidir.'),
('B1', 'tr', 'Keşke daha fazla dil konuşabilsem.');

-- B2 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'tr', 'İklim değişikliği hakkındaki devam eden tartışma acil dikkat gerektiriyor.'),
('B2', 'tr', 'Her zaman çevre koruma konusunda tutkuluydum.'),
('B2', 'tr', 'Karar vermeden önce birden fazla bakış açısını değerlendirmek önemlidir.'),
('B2', 'tr', 'Şirket bu yıl birçok yenilikçi strateji uyguladı.'),
('B2', 'tr', 'Kültürel farklılıkları anlamak küresel işletmede çok önemlidir.'),
('B2', 'tr', 'Araştırma bulguları bu faktörler arasında güçlü bir ilişki olduğunu gösteriyor.'),
('B2', 'tr', 'Hükümetin yeni politikası büyük tartışmalara yol açtı.'),
('B2', 'tr', 'Bu sorunları sistematik olarak ele almamız gerekiyor.'),
('B2', 'tr', 'Teknoloji iletişim şeklimizde devrim yarattı.'),
('B2', 'tr', 'Durum dikkatli değerlendirme ve stratejik planlama gerektiriyor.');

-- C1 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'tr', 'Durumun karmaşıklığı kapsamlı bir yaklaşım gerektiriyor.'),
('C1', 'tr', 'Onun etkileyici sunumu tüm izleyicileri büyüledi.'),
('C1', 'tr', 'Bu politikanın yansımaları ilk beklentilerin çok ötesine uzanıyor.'),
('C1', 'tr', 'Konuya dair nüanslı anlayışı tartışma boyunca belliydi.'),
('C1', 'tr', 'Çağdaş eğitimdeki paradigma değişimi yenilikçi metodolojiler gerektiriyor.'),
('C1', 'tr', 'Bu değişkenler arasındaki karmaşık ilişki daha fazla araştırmayı hak ediyor.'),
('C1', 'tr', 'Alandaki katkıları çığır açıcı ve etkili oldu.'),
('C1', 'tr', 'Uzmanlar arasında hakim fikir birliği bu hipotezi destekliyor.'),
('C1', 'tr', 'Bu faktörlerin birleşimi benzeri görülmemiş fırsatlar yarattı.'),
('C1', 'tr', 'Onun analizi konunun önceden gözden kaçan boyutlarını ortaya çıkardı.');

-- C2 Level - Turkish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'tr', 'Postmodern edebiyatın özgün tezahürü dilsel ustalığı örneklendirir.'),
('C2', 'tr', 'Epistemolojik değerlendirmeler ampirik araştırmanın temel öncüllerini destekler.'),
('C2', 'tr', 'Farklı teorik çerçevelerin yan yana konması karmaşık kavramsal ilişkileri açıklığa kavuşturur.'),
('C2', 'tr', 'Fenomenoloji üzerine bilgili söylemi geleneksel akademik sınırları aştı.'),
('C2', 'tr', 'Küreselleşmenin çok yönlü etkileri çağdaş toplumun her katmanına nüfuz eder.'),
('C2', 'tr', 'Tarih yazımına diyalektik yaklaşım hakim anlatılardaki içsel çelişkileri ortaya çıkarır.'),
('C2', 'tr', 'Bilincin fenomenolojik araştırması insan varoluşuna dair derin içgörüler sağlar.'),
('C2', 'tr', 'Kuantum mekaniğinin ontolojik çıkarımları teorik fizikçileri şaşırtmaya devam ediyor.'),
('C2', 'tr', 'Farklı teorilerin kapsamlı sentezi olağanüstü entelektüel keskinlik gösterdi.'),
('C2', 'tr', 'Teknolojik ilerlemenin durdurulamaz yürüyüşü benzeri görülmemiş varoluşsal sorular ortaya koyuyor.');

-- ====================
-- SPANISH (es)
-- ====================

-- A1 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'es', 'Hola, mi nombre es John.'),
('A1', 'es', 'Me gusta el café.'),
('A1', 'es', 'Este es mi amigo.'),
('A1', 'es', '¿Dónde está la biblioteca?'),
('A1', 'es', '¡Buenos días!'),
('A1', 'es', '¿Cómo estás?'),
('A1', 'es', 'Estoy bien, gracias.'),
('A1', 'es', '¿Cómo te llamas?'),
('A1', 'es', 'Encantado de conocerte.'),
('A1', 'es', 'Hasta luego.');

-- A2 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'es', 'Me gustaría una taza de café, por favor.'),
('A2', 'es', '¿Puedes ayudarme a encontrar la estación de tren?'),
('A2', 'es', '¿A qué hora comienza la reunión?'),
('A2', 'es', 'Disfruto leyendo libros en mi tiempo libre.'),
('A2', 'es', 'El clima está hermoso hoy.'),
('A2', 'es', 'Fui al cine ayer.'),
('A2', 'es', '¿Podrías hablar más despacio, por favor?'),
('A2', 'es', 'Generalmente me despierto a las siete.'),
('A2', 'es', 'Necesito comprar algunos comestibles.'),
('A2', 'es', 'La película fue realmente interesante.');

-- B1 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'es', 'He estado aprendiendo inglés durante tres años.'),
('B1', 'es', '¿Podrías explicar ese concepto con más detalle?'),
('B1', 'es', 'Estoy deseando visitar tu país.'),
('B1', 'es', 'En mi opinión, la tecnología ha cambiado nuestras vidas significativamente.'),
('B1', 'es', 'Apreciaría si pudieras ayudarme con esta tarea.'),
('B1', 'es', 'A pesar del mal tiempo, decidimos ir de excursión.'),
('B1', 'es', 'El libro que compré ayer es fascinante.'),
('B1', 'es', 'Si tuviera más tiempo, viajaría por todo el mundo.'),
('B1', 'es', 'Es importante mantener un estilo de vida saludable.'),
('B1', 'es', 'Ojalá pudiera hablar más idiomas.');

-- B2 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'es', 'El debate en curso sobre el cambio climático requiere atención inmediata.'),
('B2', 'es', 'Siempre he sido apasionado por la conservación del medio ambiente.'),
('B2', 'es', 'Es esencial considerar múltiples perspectivas antes de tomar una decisión.'),
('B2', 'es', 'La empresa ha implementado varias estrategias innovadoras este año.'),
('B2', 'es', 'Comprender las diferencias culturales es crucial en los negocios globales.'),
('B2', 'es', 'Los hallazgos de la investigación sugieren una fuerte correlación entre estos factores.'),
('B2', 'es', 'La nueva política del gobierno ha generado considerable controversia.'),
('B2', 'es', 'Necesitamos abordar estos problemas sistemáticamente.'),
('B2', 'es', 'La tecnología ha revolucionado la forma en que nos comunicamos.'),
('B2', 'es', 'La situación requiere una consideración cuidadosa y planificación estratégica.');

-- C1 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'es', 'La complejidad de la situación requiere un enfoque integral.'),
('C1', 'es', 'Su elocuente presentación cautivó a toda la audiencia.'),
('C1', 'es', 'Las ramificaciones de esta política se extienden mucho más allá de las expectativas iniciales.'),
('C1', 'es', 'Su comprensión matizada del tema fue evidente a lo largo de la discusión.'),
('C1', 'es', 'El cambio de paradigma en la educación contemporánea exige metodologías innovadoras.'),
('C1', 'es', 'La intrincada relación entre estas variables justifica una investigación más profunda.'),
('C1', 'es', 'Sus contribuciones al campo han sido innovadoras e influyentes.'),
('C1', 'es', 'El consenso prevaleciente entre los expertos apoya esta hipótesis.'),
('C1', 'es', 'La convergencia de estos factores ha creado oportunidades sin precedentes.'),
('C1', 'es', 'Su análisis reveló dimensiones previamente pasadas por alto del problema.');

-- C2 Level - Spanish
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'es', 'La manifestación quintesencial de la literatura posmoderna ejemplifica la virtuosidad lingüística.'),
('C2', 'es', 'Las consideraciones epistemológicas sustentan las premisas fundamentales de la investigación empírica.'),
('C2', 'es', 'La yuxtaposición de marcos teóricos divergentes dilucida relaciones conceptuales intrincadas.'),
('C2', 'es', 'Su erudito discurso sobre fenomenología trascendió los límites académicos convencionales.'),
('C2', 'es', 'Las implicaciones multifacéticas de la globalización impregnan cada estrato de la sociedad contemporánea.'),
('C2', 'es', 'El enfoque dialéctico de la historiografía revela contradicciones inherentes en las narrativas prevalecientes.'),
('C2', 'es', 'La investigación fenomenológica de la conciencia produce profundas perspectivas sobre la existencia humana.'),
('C2', 'es', 'Las implicaciones ontológicas de la mecánica cuántica continúan desconcertando a los físicos teóricos.'),
('C2', 'es', 'Su síntesis integral de teorías dispares demostró una notable agudeza intelectual.'),
('C2', 'es', 'La marcha inexorable del avance tecnológico plantea preguntas existenciales sin precedentes.');

-- ====================
-- FRENCH (fr)
-- ====================

-- A1 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'fr', 'Bonjour, je m''appelle John.'),
('A1', 'fr', 'J''aime le café.'),
('A1', 'fr', 'C''est mon ami.'),
('A1', 'fr', 'Où est la bibliothèque?'),
('A1', 'fr', 'Bonjour!'),
('A1', 'fr', 'Comment allez-vous?'),
('A1', 'fr', 'Je vais bien, merci.'),
('A1', 'fr', 'Comment vous appelez-vous?'),
('A1', 'fr', 'Enchanté de vous rencontrer.'),
('A1', 'fr', 'À plus tard.');

-- A2 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'fr', 'Je voudrais une tasse de café, s''il vous plaît.'),
('A2', 'fr', 'Pouvez-vous m''aider à trouver la gare?'),
('A2', 'fr', 'À quelle heure commence la réunion?'),
('A2', 'fr', 'J''aime lire des livres pendant mon temps libre.'),
('A2', 'fr', 'Le temps est magnifique aujourd''hui.'),
('A2', 'fr', 'Je suis allé au cinéma hier.'),
('A2', 'fr', 'Pourriez-vous parler plus lentement, s''il vous plaît?'),
('A2', 'fr', 'Je me réveille généralement à sept heures.'),
('A2', 'fr', 'J''ai besoin d''acheter des provisions.'),
('A2', 'fr', 'Le film était vraiment intéressant.');

-- B1 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'fr', 'J''apprends l''anglais depuis trois ans.'),
('B1', 'fr', 'Pourriez-vous expliquer ce concept plus en détail?'),
('B1', 'fr', 'J''ai hâte de visiter votre pays.'),
('B1', 'fr', 'À mon avis, la technologie a considérablement changé nos vies.'),
('B1', 'fr', 'J''apprécierais si vous pouviez m''aider avec cette tâche.'),
('B1', 'fr', 'Malgré le mauvais temps, nous avons décidé d''aller faire de la randonnée.'),
('B1', 'fr', 'Le livre que j''ai acheté hier est fascinant.'),
('B1', 'fr', 'Si j''avais plus de temps, je voyagerais autour du monde.'),
('B1', 'fr', 'Il est important de maintenir un mode de vie sain.'),
('B1', 'fr', 'J''aimerais pouvoir parler plus de langues.');

-- B2 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'fr', 'Le débat en cours sur le changement climatique nécessite une attention immédiate.'),
('B2', 'fr', 'J''ai toujours été passionné par la conservation de l''environnement.'),
('B2', 'fr', 'Il est essentiel de considérer plusieurs perspectives avant de prendre une décision.'),
('B2', 'fr', 'L''entreprise a mis en œuvre plusieurs stratégies innovantes cette année.'),
('B2', 'fr', 'Comprendre les différences culturelles est crucial dans les affaires mondiales.'),
('B2', 'fr', 'Les résultats de la recherche suggèrent une forte corrélation entre ces facteurs.'),
('B2', 'fr', 'La nouvelle politique du gouvernement a suscité une controverse considérable.'),
('B2', 'fr', 'Nous devons aborder ces problèmes systématiquement.'),
('B2', 'fr', 'La technologie a révolutionné la façon dont nous communiquons.'),
('B2', 'fr', 'La situation nécessite une réflexion approfondie et une planification stratégique.');

-- C1 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'fr', 'La complexité de la situation nécessite une approche globale.'),
('C1', 'fr', 'Sa présentation éloquente a captivé tout le public.'),
('C1', 'fr', 'Les ramifications de cette politique s''étendent bien au-delà des attentes initiales.'),
('C1', 'fr', 'Sa compréhension nuancée du sujet était évidente tout au long de la discussion.'),
('C1', 'fr', 'Le changement de paradigme dans l''éducation contemporaine exige des méthodologies innovantes.'),
('C1', 'fr', 'La relation complexe entre ces variables justifie une enquête plus approfondie.'),
('C1', 'fr', 'Ses contributions au domaine ont été révolutionnaires et influentes.'),
('C1', 'fr', 'Le consensus prévalant parmi les experts soutient cette hypothèse.'),
('C1', 'fr', 'La convergence de ces facteurs a créé des opportunités sans précédent.'),
('C1', 'fr', 'Son analyse a révélé des dimensions précédemment négligées de la question.');

-- C2 Level - French
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'fr', 'La manifestation quintessentielle de la littérature postmoderne exemplifie la virtuosité linguistique.'),
('C2', 'fr', 'Les considérations épistémologiques sous-tendent les prémisses fondamentales de la recherche empirique.'),
('C2', 'fr', 'La juxtaposition de cadres théoriques divergents éclaire des relations conceptuelles complexes.'),
('C2', 'fr', 'Son discours érudit sur la phénoménologie a transcendé les frontières académiques conventionnelles.'),
('C2', 'fr', 'Les implications multifacettes de la mondialisation imprègnent chaque strate de la société contemporaine.'),
('C2', 'fr', 'L''approche dialectique de l''historiographie révèle des contradictions inhérentes aux récits prévalents.'),
('C2', 'fr', 'L''investigation phénoménologique de la conscience produit des perspectives profondes sur l''existence humaine.'),
('C2', 'fr', 'Les implications ontologiques de la mécanique quantique continuent de déconcerter les physiciens théoriques.'),
('C2', 'fr', 'Sa synthèse complète de théories disparates a démontré une acuité intellectuelle remarquable.'),
('C2', 'fr', 'La marche inexorable du progrès technologique pose des questions existentielles sans précédent.');

-- ====================
-- GERMAN (de)
-- ====================

-- A1 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'de', 'Hallo, mein Name ist John.'),
('A1', 'de', 'Ich mag Kaffee.'),
('A1', 'de', 'Das ist mein Freund.'),
('A1', 'de', 'Wo ist die Bibliothek?'),
('A1', 'de', 'Guten Morgen!'),
('A1', 'de', 'Wie geht es dir?'),
('A1', 'de', 'Mir geht es gut, danke.'),
('A1', 'de', 'Wie heißt du?'),
('A1', 'de', 'Schön dich kennenzulernen.'),
('A1', 'de', 'Bis später.');

-- A2 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'de', 'Ich hätte gerne eine Tasse Kaffee, bitte.'),
('A2', 'de', 'Können Sie mir helfen, den Bahnhof zu finden?'),
('A2', 'de', 'Um wie viel Uhr beginnt das Meeting?'),
('A2', 'de', 'Ich lese gerne Bücher in meiner Freizeit.'),
('A2', 'de', 'Das Wetter ist heute wunderschön.'),
('A2', 'de', 'Ich war gestern im Kino.'),
('A2', 'de', 'Könnten Sie bitte langsamer sprechen?'),
('A2', 'de', 'Ich wache normalerweise um sieben Uhr auf.'),
('A2', 'de', 'Ich muss einige Lebensmittel einkaufen.'),
('A2', 'de', 'Der Film war wirklich interessant.');

-- B1 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'de', 'Ich lerne seit drei Jahren Englisch.'),
('B1', 'de', 'Könnten Sie dieses Konzept genauer erklären?'),
('B1', 'de', 'Ich freue mich darauf, Ihr Land zu besuchen.'),
('B1', 'de', 'Meiner Meinung nach hat die Technologie unser Leben erheblich verändert.'),
('B1', 'de', 'Ich wäre dankbar, wenn Sie mir bei dieser Aufgabe helfen könnten.'),
('B1', 'de', 'Trotz des schlechten Wetters haben wir beschlossen, wandern zu gehen.'),
('B1', 'de', 'Das Buch, das ich gestern gekauft habe, ist faszinierend.'),
('B1', 'de', 'Wenn ich mehr Zeit hätte, würde ich um die Welt reisen.'),
('B1', 'de', 'Es ist wichtig, einen gesunden Lebensstil zu pflegen.'),
('B1', 'de', 'Ich wünschte, ich könnte mehr Sprachen sprechen.');

-- B2 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'de', 'Die laufende Debatte über den Klimawandel erfordert sofortige Aufmerksamkeit.'),
('B2', 'de', 'Ich war schon immer leidenschaftlich am Umweltschutz interessiert.'),
('B2', 'de', 'Es ist wichtig, mehrere Perspektiven zu berücksichtigen, bevor man eine Entscheidung trifft.'),
('B2', 'de', 'Das Unternehmen hat dieses Jahr mehrere innovative Strategien umgesetzt.'),
('B2', 'de', 'Das Verständnis kultureller Unterschiede ist entscheidend im globalen Geschäft.'),
('B2', 'de', 'Die Forschungsergebnisse deuten auf eine starke Korrelation zwischen diesen Faktoren hin.'),
('B2', 'de', 'Die neue Politik der Regierung hat erhebliche Kontroversen ausgelöst.'),
('B2', 'de', 'Wir müssen diese Probleme systematisch angehen.'),
('B2', 'de', 'Die Technologie hat die Art und Weise, wie wir kommunizieren, revolutioniert.'),
('B2', 'de', 'Die Situation erfordert sorgfältige Überlegung und strategische Planung.');

-- C1 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'de', 'Die Komplexität der Situation erfordert einen umfassenden Ansatz.'),
('C1', 'de', 'Ihr eloquenter Vortrag faszinierte das gesamte Publikum.'),
('C1', 'de', 'Die Auswirkungen dieser Politik gehen weit über die ursprünglichen Erwartungen hinaus.'),
('C1', 'de', 'Sein nuanciertes Verständnis des Themas war während der gesamten Diskussion offensichtlich.'),
('C1', 'de', 'Der Paradigmenwechsel in der zeitgenössischen Bildung erfordert innovative Methodologien.'),
('C1', 'de', 'Die komplexe Beziehung zwischen diesen Variablen rechtfertigt weitere Untersuchungen.'),
('C1', 'de', 'Ihre Beiträge zum Bereich waren bahnbrechend und einflussreich.'),
('C1', 'de', 'Der vorherrschende Konsens unter Experten unterstützt diese Hypothese.'),
('C1', 'de', 'Die Konvergenz dieser Faktoren hat beispiellose Möglichkeiten geschaffen.'),
('C1', 'de', 'Seine Analyse enthüllte zuvor übersehene Dimensionen des Problems.');

-- C2 Level - German
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'de', 'Die quintessenzielle Manifestation der postmodernen Literatur exemplifiziert sprachliche Virtuosität.'),
('C2', 'de', 'Erkenntnistheoretische Überlegungen stützen die fundamentalen Prämissen der empirischen Forschung.'),
('C2', 'de', 'Die Gegenüberstellung divergenter theoretischer Rahmenbedingungen erhellt komplexe konzeptuelle Beziehungen.'),
('C2', 'de', 'Ihr gelehrter Diskurs über Phänomenologie überschritt konventionelle akademische Grenzen.'),
('C2', 'de', 'Die vielschichtigen Implikationen der Globalisierung durchdringen jede Schicht der zeitgenössischen Gesellschaft.'),
('C2', 'de', 'Der dialektische Ansatz zur Geschichtsschreibung offenbart inhärente Widersprüche in vorherrschenden Narrativen.'),
('C2', 'de', 'Die phänomenologische Untersuchung des Bewusstseins liefert tiefe Einblicke in die menschliche Existenz.'),
('C2', 'de', 'Die ontologischen Implikationen der Quantenmechanik verwirren theoretische Physiker weiterhin.'),
('C2', 'de', 'Ihre umfassende Synthese disparater Theorien demonstrierte bemerkenswerte intellektuelle Schärfe.'),
('C2', 'de', 'Der unaufhaltsame Marsch des technologischen Fortschritts stellt beispiellose existenzielle Fragen.');

-- ====================
-- ITALIAN (it)
-- ====================

-- A1 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'it', 'Ciao, mi chiamo John.'),
('A1', 'it', 'Mi piace il caffè.'),
('A1', 'it', 'Questo è il mio amico.'),
('A1', 'it', 'Dov''è la biblioteca?'),
('A1', 'it', 'Buongiorno!'),
('A1', 'it', 'Come stai?'),
('A1', 'it', 'Sto bene, grazie.'),
('A1', 'it', 'Come ti chiami?'),
('A1', 'it', 'Piacere di conoscerti.'),
('A1', 'it', 'A dopo.');

-- A2 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'it', 'Vorrei una tazza di caffè, per favore.'),
('A2', 'it', 'Puoi aiutarmi a trovare la stazione ferroviaria?'),
('A2', 'it', 'A che ora inizia la riunione?'),
('A2', 'it', 'Mi piace leggere libri nel mio tempo libero.'),
('A2', 'it', 'Il tempo è bellissimo oggi.'),
('A2', 'it', 'Sono andato al cinema ieri.'),
('A2', 'it', 'Potresti parlare più lentamente, per favore?'),
('A2', 'it', 'Di solito mi sveglio alle sette.'),
('A2', 'it', 'Devo comprare della spesa.'),
('A2', 'it', 'Il film era davvero interessante.');

-- B1 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'it', 'Sto imparando l''inglese da tre anni.'),
('B1', 'it', 'Potresti spiegare quel concetto più in dettaglio?'),
('B1', 'it', 'Non vedo l''ora di visitare il tuo paese.'),
('B1', 'it', 'Secondo me, la tecnologia ha cambiato significativamente le nostre vite.'),
('B1', 'it', 'Apprezzerei se potessi aiutarmi con questo compito.'),
('B1', 'it', 'Nonostante il brutto tempo, abbiamo deciso di andare a fare escursioni.'),
('B1', 'it', 'Il libro che ho comprato ieri è affascinante.'),
('B1', 'it', 'Se avessi più tempo, viaggerei in tutto il mondo.'),
('B1', 'it', 'È importante mantenere uno stile di vita sano.'),
('B1', 'it', 'Vorrei poter parlare più lingue.');

-- B2 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'it', 'Il dibattito in corso sul cambiamento climatico richiede attenzione immediata.'),
('B2', 'it', 'Sono sempre stato appassionato di conservazione ambientale.'),
('B2', 'it', 'È essenziale considerare multiple prospettive prima di prendere una decisione.'),
('B2', 'it', 'L''azienda ha implementato diverse strategie innovative quest''anno.'),
('B2', 'it', 'Comprendere le differenze culturali è cruciale negli affari globali.'),
('B2', 'it', 'I risultati della ricerca suggeriscono una forte correlazione tra questi fattori.'),
('B2', 'it', 'La nuova politica del governo ha scatenato notevoli controversie.'),
('B2', 'it', 'Dobbiamo affrontare questi problemi sistematicamente.'),
('B2', 'it', 'La tecnologia ha rivoluzionato il modo in cui comunichiamo.'),
('B2', 'it', 'La situazione richiede una considerazione attenta e una pianificazione strategica.');

-- C1 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'it', 'La complessità della situazione richiede un approccio completo.'),
('C1', 'it', 'La sua presentazione eloquente ha catturato l''intero pubblico.'),
('C1', 'it', 'Le ramificazioni di questa politica si estendono ben oltre le aspettative iniziali.'),
('C1', 'it', 'La sua comprensione sfumata dell''argomento era evidente durante tutta la discussione.'),
('C1', 'it', 'Il cambiamento di paradigma nell''educazione contemporanea richiede metodologie innovative.'),
('C1', 'it', 'La relazione intricata tra queste variabili giustifica ulteriori indagini.'),
('C1', 'it', 'I suoi contributi al campo sono stati rivoluzionari e influenti.'),
('C1', 'it', 'Il consenso prevalente tra gli esperti supporta questa ipotesi.'),
('C1', 'it', 'La convergenza di questi fattori ha creato opportunità senza precedenti.'),
('C1', 'it', 'La sua analisi ha rivelato dimensioni precedentemente trascurate del problema.');

-- C2 Level - Italian
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'it', 'La manifestazione quintessenziale della letteratura postmoderna esemplifica la virtuosità linguistica.'),
('C2', 'it', 'Le considerazioni epistemologiche sostengono le premesse fondamentali della ricerca empirica.'),
('C2', 'it', 'La giustapposizione di quadri teorici divergenti chiarisce relazioni concettuali intricate.'),
('C2', 'it', 'Il suo discorso erudito sulla fenomenologia ha trasceso i confini accademici convenzionali.'),
('C2', 'it', 'Le implicazioni multiformi della globalizzazione permeano ogni strato della società contemporanea.'),
('C2', 'it', 'L''approccio dialettico alla storiografia rivela contraddizioni intrinseche nelle narrative prevalenti.'),
('C2', 'it', 'L''indagine fenomenologica della coscienza produce profonde intuizioni sull''esistenza umana.'),
('C2', 'it', 'Le implicazioni ontologiche della meccanica quantistica continuano a sconcertare i fisici teorici.'),
('C2', 'it', 'La sua sintesi completa di teorie disparate ha dimostrato una notevole acutezza intellettuale.'),
('C2', 'it', 'La marcia inesorabile del progresso tecnologico pone domande esistenziali senza precedenti.');

-- ====================
-- PORTUGUESE (pt)
-- ====================

-- A1 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'pt', 'Olá, meu nome é John.'),
('A1', 'pt', 'Eu gosto de café.'),
('A1', 'pt', 'Este é meu amigo.'),
('A1', 'pt', 'Onde fica a biblioteca?'),
('A1', 'pt', 'Bom dia!'),
('A1', 'pt', 'Como você está?'),
('A1', 'pt', 'Estou bem, obrigado.'),
('A1', 'pt', 'Qual é o seu nome?'),
('A1', 'pt', 'Prazer em conhecê-lo.'),
('A1', 'pt', 'Até logo.');

-- A2 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'pt', 'Eu gostaria de uma xícara de café, por favor.'),
('A2', 'pt', 'Você pode me ajudar a encontrar a estação de trem?'),
('A2', 'pt', 'Que horas a reunião começa?'),
('A2', 'pt', 'Eu gosto de ler livros no meu tempo livre.'),
('A2', 'pt', 'O tempo está lindo hoje.'),
('A2', 'pt', 'Eu fui ao cinema ontem.'),
('A2', 'pt', 'Você poderia falar mais devagar, por favor?'),
('A2', 'pt', 'Eu geralmente acordo às sete horas.'),
('A2', 'pt', 'Preciso comprar algumas compras.'),
('A2', 'pt', 'O filme foi realmente interessante.');

-- B1 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'pt', 'Eu tenho aprendido inglês há três anos.'),
('B1', 'pt', 'Você poderia explicar esse conceito com mais detalhes?'),
('B1', 'pt', 'Estou ansioso para visitar seu país.'),
('B1', 'pt', 'Na minha opinião, a tecnologia mudou significativamente nossas vidas.'),
('B1', 'pt', 'Eu apreciaria se você pudesse me ajudar com esta tarefa.'),
('B1', 'pt', 'Apesar do mau tempo, decidimos ir fazer caminhadas.'),
('B1', 'pt', 'O livro que comprei ontem é fascinante.'),
('B1', 'pt', 'Se eu tivesse mais tempo, viajaria pelo mundo.'),
('B1', 'pt', 'É importante manter um estilo de vida saudável.'),
('B1', 'pt', 'Eu gostaria de poder falar mais idiomas.');

-- B2 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'pt', 'O debate em curso sobre mudanças climáticas requer atenção imediata.'),
('B2', 'pt', 'Sempre fui apaixonado por conservação ambiental.'),
('B2', 'pt', 'É essencial considerar múltiplas perspectivas antes de tomar uma decisão.'),
('B2', 'pt', 'A empresa implementou várias estratégias inovadoras este ano.'),
('B2', 'pt', 'Entender as diferenças culturais é crucial nos negócios globais.'),
('B2', 'pt', 'Os achados da pesquisa sugerem uma forte correlação entre esses fatores.'),
('B2', 'pt', 'A nova política do governo gerou considerável controvérsia.'),
('B2', 'pt', 'Precisamos abordar essas questões sistematicamente.'),
('B2', 'pt', 'A tecnologia revolucionou a forma como nos comunicamos.'),
('B2', 'pt', 'A situação requer consideração cuidadosa e planejamento estratégico.');

-- C1 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'pt', 'A complexidade da situação requer uma abordagem abrangente.'),
('C1', 'pt', 'Sua apresentação eloquente cativou toda a plateia.'),
('C1', 'pt', 'As ramificações desta política se estendem muito além das expectativas iniciais.'),
('C1', 'pt', 'Sua compreensão matizada do assunto foi evidente durante toda a discussão.'),
('C1', 'pt', 'A mudança de paradigma na educação contemporânea exige metodologias inovadoras.'),
('C1', 'pt', 'A relação intrincada entre essas variáveis justifica investigação adicional.'),
('C1', 'pt', 'Suas contribuições para o campo foram inovadoras e influentes.'),
('C1', 'pt', 'O consenso prevalente entre especialistas apoia esta hipótese.'),
('C1', 'pt', 'A convergência desses fatores criou oportunidades sem precedentes.'),
('C1', 'pt', 'Sua análise revelou dimensões anteriormente negligenciadas da questão.');

-- C2 Level - Portuguese
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'pt', 'A manifestação quintessencial da literatura pós-moderna exemplifica a virtuosidade linguística.'),
('C2', 'pt', 'Considerações epistemológicas sustentam as premissas fundamentais da pesquisa empírica.'),
('C2', 'pt', 'A justaposição de quadros teóricos divergentes esclarece relações conceituais intrincadas.'),
('C2', 'pt', 'Seu discurso erudito sobre fenomenologia transcendeu os limites acadêmicos convencionais.'),
('C2', 'pt', 'As implicações multifacetadas da globalização permeiam cada estrato da sociedade contemporânea.'),
('C2', 'pt', 'A abordagem dialética da historiografia revela contradições inerentes nas narrativas prevalentes.'),
('C2', 'pt', 'A investigação fenomenológica da consciência produz insights profundos sobre a existência humana.'),
('C2', 'pt', 'As implicações ontológicas da mecânica quântica continuam a confundir físicos teóricos.'),
('C2', 'pt', 'Sua síntese abrangente de teorias díspares demonstrou notável acuidade intelectual.'),
('C2', 'pt', 'A marcha inexorável do avanço tecnológico apresenta questões existenciais sem precedentes.');

-- ====================
-- ARABIC (ar)
-- ====================

-- A1 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A1', 'ar', 'مرحبا، اسمي جون.'),
('A1', 'ar', 'أحب القهوة.'),
('A1', 'ar', 'هذا صديقي.'),
('A1', 'ar', 'أين المكتبة؟'),
('A1', 'ar', 'صباح الخير!'),
('A1', 'ar', 'كيف حالك؟'),
('A1', 'ar', 'أنا بخير، شكرا لك.'),
('A1', 'ar', 'ما اسمك؟'),
('A1', 'ar', 'سررت بلقائك.'),
('A1', 'ar', 'أراك لاحقا.');

-- A2 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('A2', 'ar', 'أود فنجان قهوة من فضلك.'),
('A2', 'ar', 'هل يمكنك مساعدتي في العثور على محطة القطار؟'),
('A2', 'ar', 'في أي ساعة تبدأ الاجتماع؟'),
('A2', 'ar', 'أستمتع بقراءة الكتب في وقت فراغي.'),
('A2', 'ar', 'الطقس جميل اليوم.'),
('A2', 'ar', 'ذهبت إلى السينما أمس.'),
('A2', 'ar', 'هل يمكنك التحدث ببطء أكثر من فضلك؟'),
('A2', 'ar', 'عادة ما أستيقظ في الساعة السابعة.'),
('A2', 'ar', 'أحتاج إلى شراء بعض البقالة.'),
('A2', 'ar', 'كان الفيلم مثيرا للاهتمام حقا.');

-- B1 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B1', 'ar', 'أنا أتعلم الإنجليزية منذ ثلاث سنوات.'),
('B1', 'ar', 'هل يمكنك شرح هذا المفهوم بتفصيل أكثر؟'),
('B1', 'ar', 'أتطلع إلى زيارة بلدك.'),
('B1', 'ar', 'في رأيي، غيرت التكنولوجيا حياتنا بشكل كبير.'),
('B1', 'ar', 'سأكون ممتنا إذا استطعت مساعدتي في هذه المهمة.'),
('B1', 'ar', 'رغم الطقس السيء، قررنا الذهاب في نزهة.'),
('B1', 'ar', 'الكتاب الذي اشتريته أمس رائع.'),
('B1', 'ar', 'لو كان لدي المزيد من الوقت، لسافرت حول العالم.'),
('B1', 'ar', 'من المهم الحفاظ على نمط حياة صحي.'),
('B1', 'ar', 'أتمنى لو أستطيع التحدث بلغات أكثر.');

-- B2 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('B2', 'ar', 'النقاش المستمر حول تغير المناخ يتطلب اهتماما فوريا.'),
('B2', 'ar', 'كنت دائما شغوفا بحماية البيئة.'),
('B2', 'ar', 'من الضروري النظر في وجهات نظر متعددة قبل اتخاذ قرار.'),
('B2', 'ar', 'نفذت الشركة عدة استراتيجيات مبتكرة هذا العام.'),
('B2', 'ar', 'فهم الاختلافات الثقافية أمر بالغ الأهمية في الأعمال العالمية.'),
('B2', 'ar', 'تشير نتائج البحث إلى وجود علاقة قوية بين هذه العوامل.'),
('B2', 'ar', 'أثارت السياسة الجديدة للحكومة جدلا كبيرا.'),
('B2', 'ar', 'نحتاج إلى معالجة هذه القضايا بشكل منهجي.'),
('B2', 'ar', 'أحدثت التكنولوجيا ثورة في طريقة تواصلنا.'),
('B2', 'ar', 'الوضع يتطلب تفكيرا دقيقا وتخطيطا استراتيجيا.');

-- C1 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C1', 'ar', 'تعقيد الوضع يتطلب نهجا شاملا.'),
('C1', 'ar', 'أسر عرضها البليغ الجمهور بأكمله.'),
('C1', 'ar', 'تداعيات هذه السياسة تمتد إلى ما هو أبعد بكثير من التوقعات الأولية.'),
('C1', 'ar', 'كان فهمه الدقيق للموضوع واضحا طوال المناقشة.'),
('C1', 'ar', 'التحول النموذجي في التعليم المعاصر يتطلب منهجيات مبتكرة.'),
('C1', 'ar', 'العلاقة المعقدة بين هذه المتغيرات تستدعي مزيدا من التحقيق.'),
('C1', 'ar', 'كانت مساهماتها في المجال رائدة ومؤثرة.'),
('C1', 'ar', 'الإجماع السائد بين الخبراء يدعم هذه الفرضية.'),
('C1', 'ar', 'تقارب هذه العوامل خلق فرصا غير مسبوقة.'),
('C1', 'ar', 'كشف تحليله عن أبعاد تم تجاهلها سابقا للقضية.');

-- C2 Level - Arabic
INSERT INTO sentence_banks (level, language_code, sentence) VALUES
('C2', 'ar', 'التجلي المثالي للأدب ما بعد الحداثي يجسد البراعة اللغوية.'),
('C2', 'ar', 'الاعتبارات المعرفية تدعم المقدمات الأساسية للبحث التجريبي.'),
('C2', 'ar', 'الموازنة بين الأطر النظرية المتباينة توضح العلاقات المفاهيمية المعقدة.'),
('C2', 'ar', 'خطابها العالمي حول الظاهراتية تجاوز الحدود الأكاديمية التقليدية.'),
('C2', 'ar', 'الآثار متعددة الأوجه للعولمة تتخلل كل طبقة من طبقات المجتمع المعاصر.'),
('C2', 'ar', 'النهج الجدلي في التأريخ يكشف عن تناقضات جوهرية في السرديات السائدة.'),
('C2', 'ar', 'التحقيق الظاهراتي للوعي ينتج رؤى عميقة حول الوجود البشري.'),
('C2', 'ar', 'الآثار الوجودية لميكانيكا الكم تستمر في إرباك الفيزيائيين النظريين.'),
('C2', 'ar', 'تركيبها الشامل للنظريات المتباينة أظهر حدة فكرية ملحوظة.'),
('C2', 'ar', 'المسيرة التي لا تقاوم للتقدم التكنولوجي تطرح أسئلة وجودية غير مسبوقة.');

-- ===================================
-- Kayıt sayısını kontrol edin
-- ===================================
SELECT language_code, level, COUNT(*) as sentence_count 
FROM sentence_banks 
GROUP BY language_code, level 
ORDER BY language_code, level;
