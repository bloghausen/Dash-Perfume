const fs = require('fs');
const data = `Marketplace	SKU Externo	Título	Quantidade	Preço Unitário	Preço Total	Comissão	Taxa de Envio	Frete recebido	Taxa de Serviço	Cupom do Vendedor	Promoção	Recebido do Marketplace	Preço de Custo	Custo Extra	Imposto	Lucro	Margem (%)
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$27,05	R$27,05	R$3,25	R$6,55		R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,49	R$7,81	28,88%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$27,05	R$27,05	R$3,25	R$6,55		R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,49	R$7,81	28,88%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW304	Perfume Deo Colônia Feminino La Bella Way 15ml Floral	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$27,05	R$27,05	R$3,25	R$6,55	R$9,99	R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,49	R$7,81	28,88%
Mercado Livre	SW507	Perfume De Bolso Deo Colônia Masculino 15 Ml Silver Intense	1	R$25,80	R$25,80	R$3,67	R$6,55	R$9,99	R$0,00	R$0,00	R$0,72	R$15,58	R$6,65	R$0,30	R$2,37	R$6,26	24,25%
Mercado Livre	SW300	Deo Colônia Perfume Feminino W12 Sexy 15ml Perfume Floral	2	R$25,89	R$51,78	R$6,22	R$13,10		R$0,00	R$0,00	R$0,00	R$32,46	R$13,30	R$0,60	R$4,76	R$13,80	26,64%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55		R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,12	R$4,52	19,67%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55		R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,12	R$4,52	19,67%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW304	Perfume Deo Colônia Feminino La Bella Way 15ml Floral	1	R$27,05	R$27,05	R$3,25	R$6,55		R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,54	R$7,76	28,68%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	1	R$26,77	R$26,77	R$3,21	R$6,55		R$0,00	R$0,00	R$0,00	R$17,01	R$6,65	R$0,30	R$2,46	R$7,60	28,38%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55		R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,12	R$4,52	19,67%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,38	R$5,61	21,66%
Mercado Livre	SW512	Perfume De Bolso Deo Colônia Masculino 15 Ml Wself	1	R$26,33	R$26,33	R$4,48	R$6,55	R$11,99	R$0,00	R$0,00	R$0,00	R$15,30	R$6,65	R$0,30	R$2,42	R$5,93	22,51%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,38	R$5,61	21,66%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55		R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,12	R$4,52	19,67%
Mercado Livre	SW501	Deo Colônia Perfume Way Million Masculino 15ml	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,41	R$6,87	26,54%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$29,09	R$29,09	R$2,50	R$6,55		R$0,00	R$0,00	R$0,99	R$20,04	R$6,65	R$0,30	R$2,68	R$10,41	35,80%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55	R$18,99	R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,38	R$5,61	21,66%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,43	R$6,85	26,44%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55		R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,16	R$4,48	19,47%
Mercado Livre	SW501	Perfume De Bolso Deo Colônia Masculino 15 Ml Way Million	2	R$29,09	R$58,18	R$8,42	R$13,10		R$0,00	R$0,00	R$1,48	R$36,66	R$13,30	R$0,60	R$5,47	R$17,29	29,72%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,00	R$23,00	R$2,86	R$6,55	R$9,99	R$0,00	R$0,00	R$1,05	R$13,59	R$6,65	R$0,30	R$2,12	R$4,52	19,67%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,38	R$5,61	21,66%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW511	Perfume Deo Colônia Masculino Imagine 15ml Cítrico Aromático	1	R$29,09	R$29,09	R$3,96	R$6,55		R$0,00	R$0,00	R$0,99	R$18,58	R$6,65	R$0,30	R$2,71	R$8,92	30,66%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$25,89	R$25,89	R$4,40	R$6,55		R$0,00	R$0,00	R$0,00	R$14,94	R$6,65	R$0,30	R$2,41	R$5,58	21,56%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$26,89	R$26,89	R$3,23	R$6,55		R$0,00	R$0,00	R$0,00	R$17,11	R$6,65	R$0,30	R$2,53	R$7,63	28,38%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$23,86	R$23,86	R$4,06	R$6,55		R$0,00	R$0,00	R$0,00	R$13,25	R$6,65	R$0,30	R$2,24	R$4,06	17,00%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$23,86	R$23,86	R$4,06	R$6,55		R$0,00	R$0,00	R$0,00	R$13,25	R$6,65	R$0,30	R$2,24	R$4,06	17,00%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$23,86	R$23,86	R$4,06	R$6,55		R$0,00	R$0,00	R$0,00	R$13,25	R$6,65	R$0,30	R$2,24	R$4,06	17,00%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$23,86	R$23,86	R$4,06	R$6,55		R$0,00	R$0,00	R$0,00	R$13,25	R$6,65	R$0,30	R$2,24	R$4,06	17,00%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$23,86	R$23,86	R$4,06	R$6,55	R$29,99	R$0,00	R$0,00	R$0,00	R$13,25	R$6,65	R$0,30	R$2,24	R$4,06	17,00%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$26,98	R$26,98	R$3,24	R$6,55		R$0,00	R$0,00	R$0,00	R$17,19	R$6,65	R$0,30	R$1,81	R$8,43	31,25%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	3	R$26,98	R$80,94	R$9,72	R$19,66		R$0,00	R$0,00	R$0,00	R$51,56	R$19,95	R$0,90	R$5,42	R$25,29	31,24%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$26,98	R$26,98	R$3,24	R$6,55		R$0,00	R$0,00	R$0,00	R$17,19	R$6,65	R$0,30	R$1,81	R$8,43	31,25%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$26,98	R$26,98	R$3,24	R$6,55		R$0,00	R$0,00	R$0,00	R$17,19	R$6,65	R$0,30	R$1,81	R$8,43	31,25%
Mercado Livre	SW305	Deo Colônia Perfume Olimpia Girl 15ml Feminino Oriental	1	R$26,59	R$26,59	R$3,19	R$6,55		R$0,00	R$0,00	R$0,00	R$16,85	R$6,65	R$0,30	R$1,78	R$8,12	30,53%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$26,55	R$26,55	R$3,19	R$6,55		R$0,00	R$0,00	R$0,00	R$16,81	R$6,65	R$0,30	R$1,78	R$8,08	30,44%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$26,24	R$26,24	R$3,19	R$6,55		R$0,00	R$0,00	R$1,27	R$16,50	R$6,65	R$0,30	R$1,76	R$7,79	29,69%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$26,24	R$26,24	R$3,19	R$6,55		R$0,00	R$0,00	R$1,27	R$16,50	R$6,65	R$0,30	R$1,76	R$7,79	29,69%
Mercado Livre	SW308	Deo Colônia Perfume Frutado Feminino Fantastic Way 15ml	1	R$25,54	R$25,54	R$1,72	R$6,55		R$0,00	R$0,00	R$1,34	R$17,27	R$6,65	R$0,30	R$1,71	R$8,61	33,71%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$26,24	R$26,24	R$3,19	R$6,55		R$0,00	R$0,00	R$1,27	R$16,50	R$6,65	R$0,30	R$1,76	R$7,79	29,69%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$25,00	R$25,00	R$2,85	R$6,55		R$0,00	R$0,00	R$1,40	R$15,60	R$6,65	R$0,30	R$1,68	R$6,97	27,90%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	2	R$26,24	R$52,48	R$6,38	R$13,10	R$9,99	R$0,00	R$0,00	R$2,54	R$33,00	R$13,30	R$0,60	R$3,52	R$15,58	29,69%
Shopee	SW308	Deo Colônia Perfume Feminino Fantastic Way 15ml Prefume Frutado Gourmand	1	R$27,30	R$27,30	R$4,91			R$4,55	R$0,00	R$0,00	R$17,84	R$6,65	R$0,30	R$1,83	R$9,06	33,19%
Shopee	SW313	Deo Colônia Perfume Aya Feminino 15ml Perfume Floral Amadeirado Almiscarado	1	R$28,89	R$28,89	R$5,20	R$12,04		R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$28,89	R$28,89	R$5,20			R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$28,89	R$28,89	R$5,20			R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW511	Perfume Deo Colônia Masculino Imagine 15ml Cítrico Aromático	1	R$28,89	R$28,89	R$5,20	R$8,69		R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,84	R$5,20			R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,68	R$9,48	32,86%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,89	R$5,20	R$12,04		R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,89	R$5,20			R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW315	Deo Colônia Perfume Gold Amber Feminino 15ml Perfume Âmbar Especiado	1	R$28,89	R$28,89	R$5,20	R$9,62		R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW306	Deo Colônia Perfume Feminino Eufórica Way 15ml Perfume Oriental Floral	1	R$28,89	R$28,89	R$5,20			R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,69	R$9,47	32,79%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,89	R$5,20	R$13,25		R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,72	R$9,44	32,69%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$31,33	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,60	R$10,82	29,77%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$36,33	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,55	R$10,87	29,93%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$36,33	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,58	R$10,84	29,85%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$36,33	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,55	R$10,87	29,93%
TikTok Shop	SW302	Deo Colônia Perfume Feminino Escandalosa 15ml Perfume Flroal De Bolsa	1	R$39,00	R$19,41	R$1,55			R$0,00	R$0,00	R$0,00	R$18,79	R$6,65	R$0,30	R$2,41	R$9,43	36,43%
TikTok Shop	SW511	Deo Colônia De Bolso PERFUME Masculino 15 ml	1	R$39,00	R$34,86	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,58	R$10,84	29,85%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$36,33	R$1,66		R$8,64	R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,60	R$10,82	29,77%
TikTok Shop	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$39,00	R$27,69	R$1,66			R$0,00	R$0,00	R$0,00	R$20,37	R$6,65	R$0,30	R$2,60	R$10,82	39,07%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,01	R$0,01	R$0,01	R$20,38	R$6,66	R$0,31	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,02	R$0,02	R$0,02	R$20,39	R$6,67	R$0,32	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,03	R$0,03	R$0,03	R$20,40	R$6,68	R$0,33	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,04	R$0,04	R$0,04	R$20,41	R$6,69	R$0,34	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,05	R$0,05	R$0,05	R$20,42	R$6,70	R$0,35	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,19	R$42,19	R$25,54			R$0,06	R$0,06	R$0,06	R$20,43	R$6,71	R$0,36	R$3,97	R$6,28	40,00%
Temu	 SW507	PERFUME SILVER INTENSE MASCULINO 15ML	1	R$42,15	R$42,15	R$25,54			R$0,07	R$0,07	R$0,07	R$20,44	R$6,72	R$0,37	R$3,96	R$6,28	40,00%
Temu	SW312	PERFUME ZANCE FEMININO 15ML	1	R$35,02	R$35,02	R$18,37			R$0,08	R$0,08	R$0,08	R$20,45	R$6,73	R$0,38	R$3,29	R$7,07	40,00%
Mercado Livre	SW510	Deo Colônia Perfume Selvagem Way Masculino 15ml De Bolso	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW501	Deo Colônia Perfume Way Million Masculino 15ml	1	R$25,89	R$25,89	R$3,11	R$6,55	R$9,99	R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,43	R$6,85	26,44%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$26,08	R$26,08	R$1,84	R$6,55	R$0,00	R$0,00	R$0,00	R$1,29	R$17,69	R$6,65	R$0,30	R$2,45	R$8,29	31,78%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	1	R$26,89	R$26,89	R$3,23	R$6,65	R$0,00	R$0,00	R$0,00	R$0,00	R$17,01	R$6,65	R$0,30	R$2,53	R$7,53	28,01%
Mercado Livre	SW305	Deo Colônia Perfume Olimpia Girl 15ml Feminino Oriental	1	R$26,89	R$26,89	R$3,23	R$6,65	R$0,00	R$0,00	R$0,00	R$0,00	R$17,01	R$6,65	R$0,30	R$2,53	R$7,53	28,01%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW505	Perfume De Bolso Deo Colônia Masculino 15 Ml Imortal	1	R$27,54	R$27,54	R$3,83	R$6,55	R$0,00	R$0,00	R$0,00	R$0,85	R$17,16	R$6,65	R$0,30	R$2,59	R$7,62	27,67%
Mercado Livre	SW311	Deo Colônia Perfume Pistachio Feminino 15ml Perfume Oriental	1	R$24,14	R$24,14	R$1,46	R$5,84	R$0,00	R$0,00	R$0,00	R$1,44	R$16,84	R$6,65	R$0,30	R$2,27	R$7,62	31,58%
Mercado Livre	SW306	Perfume Colônia Feminino Eufórica Way 15ml Oriental Floral	1	R$26,08	R$26,08	R$1,84	R$6,31	R$0,00	R$0,00	R$0,00	R$1,29	R$17,93	R$6,65	R$0,30	R$2,45	R$8,53	32,72%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$29,09	R$29,09	R$2,50	R$7,03	R$0,00	R$0,00	R$0,00	R$0,99	R$19,56	R$6,65	R$0,30	R$2,73	R$9,87	33,94%
Mercado Livre	SW511	Perfume Deo Colônia Masculino Imagine 15ml Cítrico Aromático	1	R$29,09	R$29,09	R$3,96	R$7,03	R$0,00	R$0,00	R$0,00	R$0,99	R$18,10	R$6,65	R$0,30	R$2,73	R$8,41	28,92%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$26,08	R$26,08	R$1,84	R$6,55	R$0,00	R$0,00	R$0,00	R$1,29	R$17,69	R$6,65	R$0,30	R$2,45	R$8,29	31,78%
Mercado Livre	SW500	Perfume W12 Vip Masculino 15ml	1	R$24,78	R$24,78	R$2,97	R$6,55	R$0,00	R$0,00	R$0,00	R$0,00	R$15,26	R$6,65	R$0,30	R$2,33	R$5,98	24,14%
Mercado Livre	SW500	Perfume W12 Vip Masculino 15ml	1	R$26,08	R$26,08	R$1,84	R$6,55	R$0,00	R$0,00	R$0,00	R$1,29	R$17,69	R$6,65	R$0,30	R$2,45	R$8,29	31,78%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$39,00	R$39,00	R$6,63	R$6,55	R$2,99	R$0,00	R$0,00	R$0,00	R$25,82	R$6,65	R$0,30	R$3,67	R$15,20	38,98%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	2	R$24,89	R$49,78	R$5,98	R$13,30	R$0,00	R$0,00	R$0,00	R$0,00	R$30,50	R$13,30	R$0,60	R$4,68	R$11,92	23,95%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$23,33	R$23,33	R$3,97	R$6,55	R$0,00	R$0,00	R$0,00	R$0,00	R$12,81	R$6,65	R$0,30	R$2,19	R$3,67	15,72%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$24,00	R$24,00	R$2,64	R$6,55	R$0,00	R$0,00	R$0,00	R$1,44	R$14,81	R$6,65	R$0,30	R$2,26	R$5,60	23,35%
Mercado Livre	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	2	R$26,24	R$52,48	R$6,38	R$13,10	R$0,00	R$0,00	R$0,00	R$2,54	R$33,00	R$13,30	R$0,60	R$3,57	R$15,53	29,59%
Mercado Livre	SW500	Perfume Colônia Masculino W12 Vip 15ml Oriental Amadeirado	1	R$26,55	R$26,55	R$3,19	R$6,55	R$0,00	R$0,00	R$0,00	R$0,00	R$16,81	R$6,65	R$0,30	R$1,81	R$8,05	30,34%
Mercado Livre	SW504	Perfume Deo Colônia Masculino W12 Black 15ml Aromático	1	R$26,24	R$26,24	R$1,88	R$6,55	R$0,00	R$0,00	R$0,00	R$1,27	R$17,81	R$6,65	R$0,30	R$1,78	R$9,08	34,59%
Mercado Livre	SW510	Perfume Deo Colônia Masculino Selvagem Way 15ml Aromático	1	R$26,88	R$26,88	R$3,23	R$6,55	R$0,00	R$0,00	R$0,00	R$0,00	R$17,10	R$6,65	R$0,30	R$1,83	R$8,32	30,96%
Mercado Livre	SW503	Perfume Deo Colônia Masculino Way Code Black 15ml Oriental	1	R$26,24	R$26,24	R$1,88	R$6,55	R$0,00	R$0,00	R$0,00	R$1,27	R$17,81	R$6,65	R$0,30	R$1,78	R$9,08	34,59%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,89	R$5,20	R$0,00	R$0,00	R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,72	R$9,44	32,69%
Shopee	SW503	Perfume De Bolso Deo Colônia Way Code Black Masculino 15 Ml	1	R$28,89	R$28,85	R$5,20	R$4,02	R$0,00	R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,72	R$9,44	32,69%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,89	R$5,20	R$0,00	R$0,00	R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,72	R$9,44	32,69%
Shopee	SW500	Perfume W12 Vip Masculino 15ml	1	R$28,89	R$28,88	R$5,20	R$0,00	R$0,00	R$4,58	R$0,00	R$0,00	R$19,11	R$6,65	R$0,30	R$2,72	R$9,44	32,69%
TEMU	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$35,02	R$35,02	R$0,00	R$18,37	R$0,00	R$0,00	R$0,00	R$0,00	R$16,65	R$6,65	R$0,30	R$3,30	R$7,07	42,00%
TEMU	SW508	PERFUME WBLACK CAR MASCULINO 15ML	1	R$35,02	R$35,02	R$0,00	R$18,37	R$0,00	R$0,00	R$0,00	R$0,00	R$16,65	R$6,65	R$0,30	R$3,30	R$7,07	42,00%
TEMU	SW507	Perfume Deo Colônia Masculino Silver Intense 15ml Aromático	1	R$35,02	R$35,02	R$0,00	R$18,37	R$0,00	R$0,00	R$0,00	R$0,00	R$16,65	R$6,65	R$0,30	R$3,30	R$7,07	42,00%`;

const lines = data.split('\n');
const headers = lines[0].split('\t');
let totals = { qty: 0, revenue: 0, profit: 0 };
let count = 0;

const getVal = (rowObj, exactMatches, partialMatches, avoid = []) => {
    const keys = Object.keys(rowObj);
    let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()));
    if (key) return rowObj[key];
    key = keys.find(k => {
        const kl = k.toLowerCase();
        if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
        return partialMatches.some(p => kl.includes(p.toLowerCase()));
    });
    return key ? rowObj[key] : null;
};
const parseCurrency = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let str = String(val).trim();
    let isNegative = false;
    if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
        isNegative = true;
    }
    str = str.replace(/[R$\s]/g, '');
    if (str.match(/\d+\.\d{3},\d{2}/) || str.match(/\d+,\d{2}$/)) {
        str = str.replace(/\./g, '').replace(',', '.');
    } else if (str.match(/\d+,\d+$/)) {
        str = str.replace(',', '.');
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
};

for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const rowValues = lines[i].split('\t');
    const rowObj = {};
    headers.forEach((h, idx) => {
        if (h && String(h).trim()) rowObj[String(h).trim()] = rowValues[idx];
    });

    let quantityRaw = getVal(rowObj, ['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
    let parsedQuantity = 1;
    if (quantityRaw) {
        parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
        if (isNaN(parsedQuantity)) parsedQuantity = 1;
    }

    const totalPrice = parseCurrency(getVal(rowObj, ['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido']));
    const profit = parseCurrency(getVal(rowObj, ['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(rowObj, ['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido']));

    totals.qty += parsedQuantity;
    totals.revenue += totalPrice;
    totals.profit += profit;
    count++;
}
console.log(`Count: ${count}, Qty: ${totals.qty}, Revenue: ${totals.revenue.toFixed(2)}, Profit: ${totals.profit.toFixed(2)}`);
