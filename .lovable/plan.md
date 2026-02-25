# Diagnóstico: Erro 401 BlackCat

## Situação Atual
- As chaves estão **corretamente configuradas** nos secrets (`sk_nu...` prefix, length 51)
- O formato de autenticação está correto: `Authorization: Bearer <key>` (confirmado pela própria API da BlackCat)
- A API retorna `"Invalid API key"` — a chave é reconhecida no formato, mas **rejeitada como inválida**

## Causa Raiz
A chave `sk_nuSulU54aOeREJxNdpGd0KFW4TKs5yUkEgqkU_bN_x4znZC4` está sendo **rejeitada pelo servidor da BlackCat**.

## Ações Necessárias (no painel da BlackCat)
1. Acesse https://app.blackcatpagamentos.com
2. Verifique se a **conta está ativa e aprovada**
3. Vá em Configurações → API Keys
4. Confirme se as chaves `sk_nuSulU54a...` e `pk_TScEasCW...` estão **ativas** (não revogadas)
5. Se necessário, **gere novas chaves** e atualize os secrets aqui

## O código está correto — nenhuma mudança de código é necessária
