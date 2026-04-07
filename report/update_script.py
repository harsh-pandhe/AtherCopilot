import re

with open('generate_tables.py', 'r') as f:
    content = f.read()

content = content.replace(r'\begin{longtable}', r'\begin{tabular}')
content = content.replace(r'\end{longtable}', r'\end{tabular}')
# Remove longtable headers
content = re.sub(r'\\endfirsthead.*?\\endlastfoot\n', '', content, flags=re.DOTALL)

with open('generate_tables.py', 'w') as f:
    f.write(content)
