# Configuration Orange Money / MTN Mobile Money

## 🔧 Étapes pour activer les paiements réels

### 1. Créer un compte développeur Orange Money

1. Allez sur https://developer.orange.com/
2. Créez un compte développeur
3. Souscrivez à l'API **Orange Money Webpay** pour le Cameroun
4. Récupérez vos identifiants :
   - `Client ID`
   - `Client Secret`
   - `Merchant Key`

### 2. Ajouter les clés dans Django settings.py

Ouvrez `backend/core/settings.py` et ajoutez à la fin :

```python
# Orange Money Configuration
ORANGE_MONEY_CLIENT_ID = 'votre_client_id_ici'
ORANGE_MONEY_CLIENT_SECRET = 'votre_client_secret_ici'
ORANGE_MONEY_MERCHANT_KEY = 'votre_merchant_key_ici'

# URLs API Orange Money (Production)
ORANGE_MONEY_TOKEN_URL = 'https://api.orange.com/oauth/v3/token'
ORANGE_MONEY_PAYMENT_URL = 'https://api.orange.com/orange-money-webpay/cm/v1/webpayment'

# Pour les tests, utilisez l'environnement sandbox :
# ORANGE_MONEY_TOKEN_URL = 'https://api.orange.com/oauth/v3/token'
# ORANGE_MONEY_PAYMENT_URL = 'https://api.orange.com/orange-money-webpay/cm/v1/sandbox/webpayment'
```

### 3. Installer la dépendance requests

```bash
cd backend
pip install requests
pip freeze > requirements.txt
```

### 4. Comment ça fonctionne

1. **L'utilisateur clique sur "Payer"** → Le backend appelle l'API Orange Money
2. **Orange Money envoie un USSD** au téléphone du client (657948848)
3. **Le client compose son code secret** sur son téléphone
4. **Orange Money appelle le webhook** `/api/users/transactions/{id}/callback/`
5. **Les crédits sont automatiquement ajoutés** au compte

### 5. Mode Simulation (Actuel)

Tant que les clés ne sont pas configurées, le système fonctionne en **mode simulation** :
- Aucun vrai message USSD n'est envoyé
- Le message indique `[MODE SIMULATION]`
- Vous pouvez tester le flux complet sans vraie transaction

### 6. MTN Mobile Money (À configurer)

Pour MTN, suivez un processus similaire :
1. Créez un compte sur https://momodeveloper.mtn.com/
2. Récupérez vos clés API
3. Ajoutez-les dans `settings.py` :

```python
MTN_MOMO_API_USER = 'votre_api_user'
MTN_MOMO_API_KEY = 'votre_api_key'
MTN_MOMO_SUBSCRIPTION_KEY = 'votre_subscription_key'
```

## 📞 Support

- Orange Money API Docs: https://developer.orange.com/apis/orange-money-webpay/
- MTN MoMo Docs: https://momodeveloper.mtn.com/

## ⚠️ Important

- **Ne commitez JAMAIS vos clés API** sur GitHub
- Utilisez des variables d'environnement en production
- Testez d'abord en mode sandbox avant la production
