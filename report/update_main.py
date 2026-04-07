import re

with open('main.tex', 'r') as f:
    content = f.read()

# 1. Update Chapter Scroll Image
content = content.replace('{images/chapter_bg.jpeg}', '{images/chapter_scroll.jpeg}')

# 2. Update Header and Footer
fancyhdr_setup = r"""\pagestyle{fancy}
\fancyhf{}
\fancyhead[C]{\textbf{\MakeUppercase{Ather Co-Pilot}}}
\fancyfoot[C]{\thepage}
\fancyfoot[L]{\small SPM Polytechnic Kumathe Solapur}
\renewcommand{\headrulewidth}{0.4pt}
"""

# Replace existing \pagestyle{fancy} block (up to right before \begin{document})
content = re.sub(r'\\pagestyle\{fancy\}.*?\\renewcommand\{\\headrulewidth\}\{0pt\}', fancyhdr_setup, content, flags=re.DOTALL)
content = re.sub(r'\\fancypagestyle\{plain\}\{.*?\\renewcommand\{\\headrulewidth\}\{0pt\}\n\}', '', content, flags=re.DOTALL)


# 3. Replace TOC, LOF, LOT with includes
content = content.replace(r'\tableofcontents', r'\include{chapters/toc_table}')
content = content.replace(r'\listoffigures', r'\include{chapters/lof_table}')
content = content.replace(r'\listoftables', r'\include{chapters/lot_table}')

with open('main.tex', 'w') as f:
    f.write(content)
