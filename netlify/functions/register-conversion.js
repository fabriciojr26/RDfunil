const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const purchaseData = JSON.parse(event.body);

  const PIXEL_ID = 'SEU_PIXEL_ID_AQUI';
  const ACCESS_TOKEN = 'SEU_TOKEN_DE_ACESSO_DA_API_DE_CONVERSÃO';
  const TEST_EVENT_CODE = purchaseData.testEventCode; // Recebe o código de teste

  const payload = {
    data: [
      {
        event_name: 'Purchase',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {},
        custom_data: {
          currency: purchaseData.currency,
          value: purchaseData.value,
          content_name: purchaseData.planName,
        },
      },
    ],
    test_event_code: TEST_EVENT_CODE,
  };

  try {
    await fetch(`https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Conversão registrada com sucesso!' }),
    };

  } catch (error) {
    console.error('Erro ao registrar conversão:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Falha ao registrar conversão' }),
    };
  }
};
