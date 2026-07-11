import csv
with open('test-sample.cjs', 'r') as f:
    lines = f.readlines()

start = 0
for i, l in enumerate(lines):
    if 'const data = `' in l:
        lines[i] = l.replace('const data = `', '')
        start = i
        break

data_lines = []
for i in range(start, len(lines)):
    if '`;' in lines[i]:
        data_lines.append(lines[i].replace('`;', '').strip())
        break
    if lines[i].strip():
        data_lines.append(lines[i].strip())

headers = data_lines[0].split('\t')
print("Headers:", headers)
idx_pt = headers.index('Preço Total')
idx_luc = headers.index('Lucro')
idx_q = headers.index('Quantidade')
idx_rec = headers.index('Recebido do Marketplace')

tot_pt = 0
tot_luc = 0
tot_q = 0
tot_rec = 0

for line in data_lines[1:]:
    cols = line.split('\t')
    if len(cols) > idx_pt:
        v = cols[idx_pt].replace('R$', '').replace('.', '').replace(',', '.').strip()
        if v: tot_pt += float(v)
    if len(cols) > idx_luc:
        v = cols[idx_luc].replace('R$', '').replace('.', '').replace(',', '.').strip()
        if v: tot_luc += float(v)
    if len(cols) > idx_q:
        v = cols[idx_q].strip()
        if v: tot_q += float(v)
    if len(cols) > idx_rec:
        v = cols[idx_rec].replace('R$', '').replace('.', '').replace(',', '.').strip()
        if v: tot_rec += float(v)

print(f"Preço Total: {tot_pt:.2f}")
print(f"Lucro: {tot_luc:.2f}")
print(f"Quantidade: {tot_q:.2f}")
print(f"Recebido: {tot_rec:.2f}")
