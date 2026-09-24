# 02_CATALOGO_E_TAXONOMIA_PROJETOS.md

# Catálogo Canônico dos 33 Projetos Skip Cloud e Taxonomia

## 1. Padrão Canônico de Nomenclatura (SSOT)

Todos os projetos e artefatos gerados seguem a fórmula:
`[dominio]__[slug_semantico]__[skip_uuid_curto]`

- `mfo__*`: Multi-Family Office, Gestão Patrimonial, BTG, Imobiliário e Finanças.
- `legal__*`: Jurídico, Sucessório, Tributário, IRPF e Dossiês Fiscais.
- `agent__*`: MoE (Mixture of Experts), Prompts, Builder e Orquestração.
- `comm__*`: WhatsApp, YouTube, CRM e Omnichannel.
- `tpl__*`: Templates base e clones descartáveis.

---

## 2. Inventário Completo e Mapeamento de Schemas (Seção 12)

| ID Curto   | Nome Original                        | Slug Padronizado                                    | Domínio | Schema Supabase Self-Hosted | Upstream / Downstream              |
| ---------- | ------------------------------------ | --------------------------------------------------- | ------- | --------------------------- | ---------------------------------- |
| `f5b6d759` | Dashboard Financeiro Contemporâneo   | `mfo__dashboard_financeiro_contemporaneo__f5b6d759` | mfo     | `skip_dashboard_financeir`  | Skip Cloud -> `proj_00_mfo`        |
| `90713eca` | App Financeiro PRD                   | `mfo__app_financeiro_prd__90713eca`                 | mfo     | `skip_app_financeiro_prd`   | BTG/Comdinheiro -> `proj_00_mfo`   |
| `3554ae71` | Financial OS                         | `tpl__financial_os__3554ae71`                       | tpl     | `skip_financial_os`         | Open Finance -> Prototipação       |
| `8551de02` | finance                              | `mfo__finance__8551de02`                            | mfo     | `skip_finance`              | Supabase -> `proj_00_mfo`          |
| `920158e7` | Template ERP Jurídico                | `legal__template_erp_juridico__920158e7`            | legal   | `skip_template_erp_jurid`   | Base Legal -> `proj_00_legal`      |
| `14e5db51` | Nova Tributação de Dividendos        | `legal__nova_tributacao_de_dividendos__14e5db51`    | legal   | `skip_nova_tributacao_de`   | Lei 15.270/2025 -> `proj_00_legal` |
| `18a9f95b` | FamilyOfficePlataforma               | `mfo__familyofficeplataforma__18a9f95b`             | mfo     | `skip_familyofficeplataf`   | MFO Core -> `proj_00_mfo`          |
| `c7a521af` | Dashboard Imobiliário Multi-tenant   | `mfo__dashboard_imobiliario_multitenant__c7a521af`  | mfo     | `skip_dashboard_imobiliar`  | Imob Data -> `avaliacao_imoveis`   |
| `7282769e` | Módulo de Integrações Externas       | `mfo__modulo_de_integracoes_externas__7282769e`     | mfo     | `skip_modulo_de_integrac`   | APIs Bancárias -> SmartHub         |
| `6fe191fc` | Sistema Multi Family Office          | `mfo__sistema_multi_family_office__6fe191fc`        | mfo     | `skip_sistema_multi_fami`   | Portal MFO -> Dossiês              |
| `9e03e010` | sucessao-inventarios                 | `legal__sucessao_inventarios__9e03e010`             | legal   | `skip_sucessao_inventari`   | Tabela ITCMD -> `proj_00_legal`    |
| `971b493b` | Avaliação Imobiliária MFO Trust      | `mfo__avaliacao_imobiliaria_mfo_trust__971b493b`    | mfo     | `skip_avaliacao_imobiliar`  | Laudos NBR -> `avaliacao_imoveis`  |
| `85dea98c` | Prompt Engineering Framework         | `agent__prompt_engineering_framework__85dea98c`     | agent   | `skip_prompt_engineering`   | LLM APIs -> `glob_00_prompts`      |
| `3334956e` | Prompt Engineering Framework (cópia) | `agent__prompt_engineering_framework__3334956e`     | agent   | `skip_prompt_engineering`   | LLM APIs -> `glob_00_prompts`      |
| `6ab4c07f` | glob_00_prompt-improver              | `agent__glob_00_prompt_improver__6ab4c07f`          | agent   | `skip_glob_00_prompt_imp`   | Metaprompt -> `glob_00_prompts`    |
| `aa3da58a` | proj_00_agentic_builder              | `agent__proj_00_agentic_builder__aa3da58a`          | agent   | `skip_proj_00_agentic_bu`   | Code Gen -> Runtime Agentes        |
| `40f84418` | Template Inteligência Pragmática     | `tpl__template_inteligencia_pragmatica__40f84418`   | tpl     | `skip_template_inteligen`   | Adapta One -> Templates            |
| `9e7a815d` | smarthub_ii                          | `mfo__smarthub_ii__9e7a815d`                        | mfo     | `skip_smarthub_ii`          | Coolify Hub -> `glob_00_smarthub`  |
| `9d7b199f` | linkedin_youtube (cópia)             | `comm__linkedin_youtube__9d7b199f`                  | comm    | `skip_linkedin_youtube`     | Transcrição -> `proj_00_linkedin`  |
| `b02266ce` | linkedin_youtube                     | `comm__linkedin_youtube__b02266ce`                  | comm    | `skip_linkedin_youtube`     | Transcrição -> `proj_00_linkedin`  |
| `164355c5` | Plataforma WhatsApp                  | `comm__plataforma_whatsapp__164355c5`               | comm    | `skip_plataforma_whatsap`   | Evolution API -> Chatwoot          |
| `0d243a9a` | Experiência Digital BTG              | `mfo__experiencia_digital_btg__0d243a9a`            | mfo     | `skip_experiencia_digita`   | Open Banking -> Portal BTG         |
| `38c20203` | Plataforma BTG Multi-Family Office   | `mfo__plataforma_btg_multi_family_office__38c20203` | mfo     | `skip_plataforma_btg_mul`   | Consolidado -> Portal MFO          |
| `01bed4ae` | SENAMFO                              | `mfo__senamfo__01bed4ae`                            | mfo     | `skip_senamfo`              | Portal Institucional -> Clientes   |
| `88be859c` | plataforma_preparatório_cfp          | `tpl__plataforma_preparatorio_cfp__88be859c`        | tpl     | `skip_plataforma_prepara`   | Banco Questões -> Alunos           |
| `21257241` | Acompanhamento Gestação              | `tpl__acompanhamento_gestacao__21257241`            | tpl     | `skip_acompanhamento_ges`   | Pessoal -> Timeline                |
| `8f1cc924` | Atendimento no WhatApp com IA        | `comm__atendimento_no_whatapp_com_ia__8f1cc924`     | comm    | `skip_atendimento_no_wha`   | Evolution API -> Agentes IA        |
| `e03b7800` | Interface para Agente de IA          | `agent__interface_para_agente_de_ia__e03b7800`      | agent   | `skip_interface_para_age`   | MCP Gateway -> Chat UI             |
| `3464349a` | Imobiliária API                      | `mfo__imobiliaria_api__3464349a`                    | mfo     | `skip_imobiliaria_api`      | Lead Pipeline -> CRM               |
| `6c00871f` | Simulador Tributário PJ              | `legal__simulador_tributario_pj__6c00871f`          | legal   | `skip_simulador_tributar`   | Reforma Tributária -> Pareceres    |
| `cc343db2` | MoE Control Tower                    | `agent__moe_control_tower__cc343db2`                | agent   | `skip_moe_control_tower`    | Orquestração MoE -> Operador       |
| `102de517` | Rendimento Genial                    | `mfo__rendimento_genial__102de517`                  | mfo     | `skip_rendimento_genial`    | Carteiras -> BI Executivo          |
| `74f06561` | IRPF_2026_2025                       | `legal__irpf_2026_2025__74f06561`                   | legal   | `skip_irpf_2026_2025`       | RFB / Extratos -> Dossiês          |
