import re
import os

def generate_toc():
    rows = []
    if os.path.exists('main.toc'):
        with open('main.toc', 'r') as f:
            content = f.read()

        lines = content.split('\n')
        numbered_re = re.compile(r'\\contentsline\s*\{chapter\}\{\\numberline\s*\{([^}]*)\}(.*?)\}\{(.*?)\}')
        unnumbered_re = re.compile(r'\\contentsline\s*\{chapter\}\{(.*?)\}\{(.*?)\}')

        sr_no = 1
        for line in lines:
            match = numbered_re.search(line)
            if match:
                ch_num = match.group(1).strip()
                ch_title = match.group(2).strip()
                page = match.group(3).strip()
                rows.append(f"{sr_no} & {ch_title} & {page} \\\\ \\hline")
                sr_no += 1
                continue
            
            match = unnumbered_re.search(line)
            if match:
                title = match.group(1).strip()
                page = match.group(2).strip()
                if "numberline" not in title:
                    rows.append(f"{sr_no} & {title} & {page} \\\\ \\hline")
                    sr_no += 1

    tex = [
        r"\begin{center}",
        r"{\LARGE\bfseries INDEX}\\[0.3em]",
        r"\hrule height 1pt",
        r"\end{center}",
        r"\addcontentsline{toc}{chapter}{Index}",
        r"\begin{center}",
        r"\renewcommand{\arraystretch}{1.0}", # Reduced stretch to fit on one page
        r"\begin{tabularx}{\textwidth}{|c|X|c|}",
        r"\hline",
        r"\textbf{Sr. No.} & \multicolumn{1}{c|}{\textbf{Chapter Title}} & \textbf{Page No.} \\ \hline"
    ]
    if rows:
        tex.extend(rows)
    else:
        tex.append(r"\multicolumn{3}{|c|}{Index will be populated in the next pass.} \\ \hline")
        
    tex.extend([
        r"\end{tabularx}",
        r"\end{center}"
    ])

    with open('chapters/toc_table.tex', 'w') as f:
        f.write('\n'.join(tex) + '\n')

def generate_lof():
    rows = []
    if os.path.exists('main.lof'):
        with open('main.lof', 'r') as f:
            content = f.read()

        lines = content.split('\n')
        fig_re = re.compile(r'\\contentsline\s*\{figure\}\{\\numberline\s*\{([^}]*)\}\{\\ignorespaces\s*(.*?)\}\}\{(.*?)\}')

        for line in lines:
            match = fig_re.search(line)
            if match:
                fig_num = match.group(1).strip()
                title = match.group(2).strip()
                page = match.group(3).strip()
                rows.append(f"{fig_num} & {title} & {page} \\\\ \\hline")

    tex = [
        r"\begin{center}",
        r"{\LARGE\bfseries FIGURE INDEX}\\[0.3em]",
        r"\hrule height 1pt",
        r"\end{center}",
        r"\addcontentsline{toc}{chapter}{Figure Index}",
        r"\begin{center}",
        r"\renewcommand{\arraystretch}{1.0}", # Reduced stretch
        r"\begin{tabularx}{\textwidth}{|c|X|c|}",
        r"\hline",
        r"\textbf{Figure No.} & \multicolumn{1}{c|}{\textbf{Figure Title}} & \textbf{Page No.} \\ \hline"
    ]
    if rows:
        tex.extend(rows)
    else:
        tex.append(r"\multicolumn{3}{|c|}{Figure Index will be populated in the next pass.} \\ \hline")

    tex.extend([
        r"\end{tabularx}",
        r"\end{center}"
    ])

    with open('chapters/lof_table.tex', 'w') as f:
        f.write('\n'.join(tex) + '\n')

if __name__ == '__main__':
    generate_toc()
    generate_lof()
