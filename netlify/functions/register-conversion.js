const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  // 1. Recebe os dados da compra enviados pelo chatbot
  const purchaseData = JSON.parse(event.body);

  // 2. Lê as chaves secretas do "cofre" da Netlify
  const PIXEL_ID = process.env.META_PIXEL_ID;
  const ACCESS_TOKEN = process.env.META_ACCESS_TOKEN;
  
  // 3. Monta o payload com os dados no formato exigido pelo Facebook
  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          // Aqui podem ser adicionados dados do cliente se os coletar (ex: email, telefone)
        },
        custom_data: {
          currency: purchaseData.currency,
          value: purchaseData.value,
          content_name: purchaseData.planName,
        },
      },
    ],
    // Adiciona o código de teste que também vem do "cofre"
    test_event_code: process.env.META_TEST_CODE,
  };

  // 4. Envia os dados para a API de Conversões da Meta
  try {
    const response = await fetch(`https://graph.facebook.com/v19.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Erro da API da Meta:', errorData);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Evento de teste enviado com sucesso!' }),
    };

  } catch (error) {
    console.error('Erro ao enviar evento:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao enviar evento' }),
    };
  }
};
