-- Seed Data: Questionários Completos
-- Este ficheiro popula a tabela questionnaires com os 5 questionários

-- ============================================================================
-- QUESTIONÁRIO 1: SAÚDE INTESTINAL
-- ============================================================================

INSERT INTO questionnaires (name, slug, description, category, questions, scoring_rules, is_active) VALUES (
  'Saúde Intestinal',
  'saude-intestinal',
  'Avaliação completa da saúde intestinal com 28 questões sobre sintomas, hábitos alimentares e estilo de vida',
  'Saúde Intestinal',
  '[
    {"id":"q1","order":1,"text":"Sentes desconforto intestinal?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com muita frequência","points":3},{"value":"sometimes","label":"Às vezes","points":1},{"value":"rarely","label":"Raramente","points":0}],"required":true},
    {"id":"q2","order":2,"text":"Sentes que tudo o que comes te faz inchar e não sabes o que é?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com muita frequência","points":3},{"value":"sometimes","label":"Às vezes, quando exagero nas quantidades","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q3","order":3,"text":"Acordas bem e vais inchando ao longo do dia?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com muita frequência","points":3},{"value":"sometimes","label":"Às vezes sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q4","order":4,"text":"Costumas passar mais de dois dias sem ir à Casa de Banho?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":3},{"value":"sometimes","label":"Às vezes sim, depende de como está a fase da vida","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q5","order":5,"text":"Tens diarreia com frequência?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":3},{"value":"sometimes","label":"Às vezes sim, depende do que eu como","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q6","order":6,"text":"Foste diagnosticado com Síndrome do Intestino Irritável?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":3},{"value":"no","label":"Não","points":0},{"value":"unsure","label":"Não sei dizer","points":1}],"required":true},
    {"id":"q7","order":7,"text":"Foste diagnosticado com alguma intolerância alimentar?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":3},{"value":"no","label":"Não","points":0},{"value":"unsure","label":"Não sei dizer","points":1}],"required":true},
    {"id":"q8","order":8,"text":"Caso a resposta anterior tenha sido SIM, qual?","type":"multiple_choice","options":[{"value":"lactose","label":"Lactose"},{"value":"fructose","label":"Frutose"},{"value":"gluten","label":"Glúten"},{"value":"other","label":"Outro","allow_text":true}],"required":false,"conditional":{"question_id":"q7","required_value":"yes"}},
    {"id":"q9","order":9,"text":"Já fizeste a dieta Low FODMAPs?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":1},{"value":"know","label":"Eu sei o que é, mas nunca testei","points":0},{"value":"no","label":"Nunca fiz e não sei o que é","points":0}],"required":true},
    {"id":"q10","order":10,"text":"Sentes ardor ou azia?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com frequência","points":3},{"value":"sometimes","label":"Às vezes, depende do que eu como","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q11","order":11,"text":"Tem cólicas/dores abdominais?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com frequência","points":3},{"value":"sometimes","label":"Às vezes, depende do que eu como","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q12","order":12,"text":"Sentes te cansado, fadigado e com falta de energia?","type":"single_choice","options":[{"value":"frequent","label":"Sim, com frequência","points":2},{"value":"sometimes","label":"Às vezes sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q13","order":13,"text":"Na escala de Bristol, qual número representa suas fezes?","type":"bristol_scale","options":[{"value":"3-4","label":"Resposta: número 3 ou 4 na escala de Bristol","points":1},{"value":"other","label":"Resposta: outros números","points":3},{"value":"varies","label":"Não sei, varia muito","points":3},{"value":"never","label":"Não sei, nunca olhei","points":0}],"required":true,"image_url":"/images/bristol-scale.png"},
    {"id":"q14","order":14,"text":"Nasceste de parto normal?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":0},{"value":"no","label":"Não","points":1},{"value":"unsure","label":"Não sei informar","points":0}],"required":true},
    {"id":"q15","order":15,"text":"Foste amamentado?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":0},{"value":"no","label":"Não","points":1},{"value":"unsure","label":"Não sei informar","points":0}],"required":true},
    {"id":"q16","order":16,"text":"Tiveste alergias na infância?","type":"single_choice","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0},{"value":"unsure","label":"Não sei informar","points":0}],"required":true},
    {"id":"q17","order":17,"text":"Tens hábito de comer depois de jantar?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q18","order":18,"text":"Vício por doces e/ou chocolate?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q19","order":19,"text":"Sentes-te fome toda hora? Vontade de beliscar?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q20","order":20,"text":"Tens compulsão alimentar?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q21","order":21,"text":"Tens retenção de líquido?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q22","order":22,"text":"Tens dores no corpo?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q23","order":23,"text":"Estás a passar por uma fase de muito stress?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":2},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q24","order":24,"text":"Dores de cabeça frequentes?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q25","order":25,"text":"Tens rinite/sinusite?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":1},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q26","order":26,"text":"Sentes-te muito ansioso?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":2},{"value":"no","label":"Não","points":0}],"required":true},
    {"id":"q27","order":27,"text":"Dormes bem?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":0},{"value":"no","label":"Não","points":1}],"required":true},
    {"id":"q28","order":28,"text":"Fazes atividade física?","type":"yes_no","options":[{"value":"yes","label":"Sim","points":0},{"value":"no","label":"Não","points":1}],"required":true}
  ]'::jsonb,
  '{
    "type": "sum",
    "classifications": [
      {
        "range": [0, 10],
        "label": "0-10 Pontos",
        "title": "Bom intestino",
        "description": "Tens um bom intestino. Continua assim! A Tua saúde intestinal aparentemente está boa. Para teres o intestino saudável é muito importante que te alimentes de maneira adequada, durmas bem, tenta ao máximo possível gerir o teu stress com práticas de meditação, respiração e prática atividade física. Lembrando que este questionário não é um diagnóstico e sim uma autoavaliação dos teus sinais e sintomas.",
        "color": "green"
      },
      {
        "range": [11, 22],
        "label": "11-22 Pontos",
        "title": "Podes melhorar",
        "description": "Provavelmente o teu intestino não te incomoda sempre, não sofres com isso, mas tem alguns sintomas que indicam que a tua saúde intestinal pode melhorar. Para o equilíbrio do teu organismo é importante que tenhas uma saúde intestinal adequada. Tenta perceber na tua alimentação se alguma coisa que comes causa desconforto, ou até mesmo no teu estado emocional, quando estás mais stressado, se tem relação com teus sintomas intestinais. Lembra-te que este questionário não é um diagnóstico e sim uma autoavaliação dos teus sinais e sintomas.",
        "color": "yellow"
      },
      {
        "range": [23, 34],
        "label": "23-34 Pontos",
        "title": "Precisas melhorar",
        "description": "Tens bastantes sintomas, isso mostra que provavelmente a tua saúde intestinal não anda tão equilibrada, mas com pequenas mudanças nos teus hábitos e estilo de vida vais te sentir melhor. Começando pela alimentação, é muito importante que avalies exatamente o que não te faz bem. Procurar um nutricionista para ajudar-te. Além da alimentação, é importante que durmas bem, pratiques atividade física e faças o possível para gerir o stresse com práticas de respiração ou meditação, o que for melhor para ti. Não deixes de acompanhar teus exames com um médico. Lembra-te o que este questionário não é um diagnóstico e sim uma autoavaliação dos teus sinais e sintomas.",
        "color": "orange"
      },
      {
        "range": [35, 999],
        "label": "Acima de 35 Pontos",
        "title": "Precisas de ajuda",
        "description": "É muito importante que avalies exatamente o que não te faz bem. Procurar um nutricionista para ajudar-te.",
        "color": "red"
      }
    ]
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- QUESTIONÁRIO 2: INTOLERÂNCIA À HISTAMINA
-- ============================================================================

INSERT INTO questionnaires (name, slug, description, category, questions, scoring_rules, is_active) VALUES (
  'Intolerância à Histamina',
  'intolerancia-histamina',
  'Questionário rápido para identificar possível intolerância à histamina',
  'Intolerâncias',
  '[
    {"id":"q1","order":1,"text":"Tens sintomas de espirros, pingo no nariz, dor de cabeça, vermelhidão logo depois de comer?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q2","order":2,"text":"Tens sintomas de diarreia, náuseas e vómitos logo após as refeições?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q3","order":3,"text":"Não te sentes bem com chocolate, vinho, café, tomate, beringela, banana?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q4","order":4,"text":"Os sintomas aparecem logo depois de fazer a refeição?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true}
  ]'::jsonb,
  '{
    "type": "threshold",
    "threshold": 2,
    "count_value": "yes",
    "classifications": [
      {
        "condition": "above_threshold",
        "title": "Possível intolerância",
        "description": "Se respondes-te mais do que dois \"sim\", fica atento, pode ser que tenhas intolerância a histamina.",
        "color": "orange"
      },
      {
        "condition": "below_threshold",
        "title": "Improvável",
        "description": "Os sintomas não indicam intolerância à histamina.",
        "color": "green"
      }
    ]
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- QUESTIONÁRIO 3: EMOCIONAL
-- ============================================================================

INSERT INTO questionnaires (name, slug, description, category, questions, scoring_rules, is_active) VALUES (
  'Avaliação Emocional',
  'emocional',
  'Avaliação do estado emocional e sua relação com a saúde intestinal',
  'Saúde Mental',
  '[
    {"id":"q1","order":1,"text":"Prendes-te muito ao passado?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q2","order":2,"text":"És muito controlador?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q3","order":3,"text":"Andas muito desmotivado, sem ânimo para nada?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q4","order":4,"text":"Sentes angústia ou um aperto no peito?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q5","order":5,"text":"Ficas com a mente muito agitada e não consegues desligar? Estás o tempo todo preocupado?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q6","order":6,"text":"Tens insónias?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q7","order":7,"text":"Sentes vontade frequente de chorar?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true}
  ]'::jsonb,
  '{
    "type": "threshold",
    "threshold": 3,
    "count_value": "yes",
    "classifications": [
      {
        "condition": "above_threshold",
        "title": "Atenção necessária",
        "description": "Se respondeste mais do que 3 \"sim\", precisamos trabalhar a tua parte emocional. Certamente, isso está impactando no funcionamento do teu intestino.",
        "color": "orange"
      },
      {
        "condition": "below_threshold",
        "title": "Estado emocional equilibrado",
        "description": "O teu estado emocional parece equilibrado.",
        "color": "green"
      }
    ]
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- QUESTIONÁRIO 4: SIFO - SUPER CRESCIMENTO FÚNGICO
-- ============================================================================

INSERT INTO questionnaires (name, slug, description, category, questions, scoring_rules, is_active) VALUES (
  'SIFO - Super crescimento Fúngico',
  'sifo',
  'Avaliação de sinais de super crescimento fúngico intestinal',
  'Saúde Intestinal',
  '[
    {"id":"q1","order":1,"text":"Estás com muita vontade de comer doces?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q2","order":2,"text":"Tens micose nas unhas ou na pele?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q3","order":3,"text":"Candidíase?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q4","order":4,"text":"Dermatite no couro cabeludo?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q5","order":5,"text":"Sistema imunológico sempre baixo?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q6","order":6,"text":"Brain fog (sensação de falta de clareza nos pensamentos)?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q7","order":7,"text":"Alergias respiratórias?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q8","order":8,"text":"Resistência aos tratamentos que já tentas-te?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true}
  ]'::jsonb,
  '{
    "type": "threshold",
    "threshold": 2,
    "count_value": "yes",
    "classifications": [
      {
        "condition": "above_threshold",
        "title": "Possível síndrome fúngica",
        "description": "Se respondes-te mais do que 2 \"sim\", pode ser indicativo de teres síndrome fúngica. Precisas te focar a tua dieta e estratégias para esse tipo de condição.",
        "color": "orange"
      },
      {
        "condition": "below_threshold",
        "title": "Improvável",
        "description": "Os sintomas não indicam super crescimento fúngico.",
        "color": "green"
      }
    ]
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- QUESTIONÁRIO 5: DOENÇA INFLAMATÓRIA INTESTINAL
-- ============================================================================

INSERT INTO questionnaires (name, slug, description, category, questions, scoring_rules, is_active) VALUES (
  'Doença Inflamatória Intestinal',
  'doenca-inflamatoria',
  'Rastreio de sinais de doença inflamatória intestinal',
  'Saúde Intestinal',
  '[
    {"id":"q1","order":1,"text":"Sangramento nas fezes?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q2","order":2,"text":"Tens evacuação no meio da madrugada, acordas para ir à casa de banho?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q3","order":3,"text":"Diarreia muitas vezes ao dia?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q4","order":4,"text":"Na tua família, tens historial para doença inflamatória intestinal?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true},
    {"id":"q5","order":5,"text":"Exame de calprotectina fecal maior que 100?","type":"yes_no","options":[{"value":"yes","label":"Sim"},{"value":"no","label":"Não"}],"required":true}
  ]'::jsonb,
  '{
    "type": "threshold",
    "threshold": 0,
    "count_value": "yes",
    "classifications": [
      {
        "condition": "above_threshold",
        "title": "Atenção - Consultar especialista",
        "description": "Se respondes-te \"sim\" para esses sintomas, pode ser sugestivo de doença inflamatória intestinal. Procure um gastroenterologista para fazer o diagnóstico.",
        "color": "red"
      },
      {
        "condition": "below_threshold",
        "title": "Sem sinais de alerta",
        "description": "Não há sinais evidentes de doença inflamatória intestinal.",
        "color": "green"
      }
    ]
  }'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;
