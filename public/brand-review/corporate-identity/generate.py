#!/usr/bin/env python3
"""FEL DRONE — Corporate Identity Review → complete multi-page PDF (A4).

Faithful reproduction of the CURRENT /brand-review/stamp/ preview:
all sections (01–07) + cover + invoice/cachet reference (08).
Vector stamps/mark/lockup; 600 dpi PNGs only for displacement-filtered
(inked) masters. Embedded TTFs: Lexend 600/700, IBM Plex Sans 400/500/600,
IBM Plex Sans Arabic 400 (shaped via arabic_reshaper + python-bidi).
"""
import math, os, re

import arabic_reshaper
import bidi
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import Color, white

ROOT = os.path.dirname(os.path.abspath(__file__))
FOUT = os.path.join(ROOT, "exports", "FEL-DRONE-Corporate-Identity-Full.pdf")
F = os.path.join(ROOT, "fonts")
INKD = os.path.join(ROOT, "assets")

NAVY = Color(0x0e / 255, 0x1f / 255, 0x30 / 255)
ACCENT = Color(0xb4 / 255, 0x72 / 255, 0x2c / 255)
INK = Color(0x1a / 255, 0x1d / 255, 0x21 / 255)
GRAY = Color(0x6a / 255, 0x6f / 255, 0x78 / 255)
LINE = Color(0xd8 / 255, 0xd5 / 255, 0xcf / 255)
LINE2 = Color(0xb9 / 255, 0xbd / 255, 0xc4 / 255)
BG = Color(0xf4 / 255, 0xf5 / 255, 0xf7 / 255)
BAR = Color(0xe3 / 255, 0xe4 / 255, 0xe6 / 255)

def _reg(name, path):
    try:
        pdfmetrics.registerFont(TTFont(name, path))
        return True
    except Exception as e:
        print("FONT FALLBACK", name, e)
        return False

F_LX7 = _reg("Lexend700", f"{F}/lexend-latin-700-normal.ttf")
F_LX6 = _reg("Lexend600", f"{F}/lexend-latin-600-normal.ttf")
F_P4 = _reg("Plex400", f"{F}/ibm-plex-sans-latin-400-normal.ttf")
F_P5 = _reg("Plex500", f"{F}/ibm-plex-sans-latin-500-normal.ttf")
F_P6 = _reg("Plex600", f"{F}/ibm-plex-sans-latin-600-normal.ttf")
F_AR = _reg("PlexArabic", f"{F}/ibm-plex-sans-arabic-400-normal.ttf")
F_ARW = _reg("ArrowF", f"{F}/arrow.ttf")  # U+2192 only (DejaVu subset) — Plex latin subsets lack the arrow

def ARW(): return "ArrowF" if F_ARW else "Helvetica"

def LX7(): return "Lexend700" if F_LX7 else "Helvetica-Bold"
def LX6(): return "Lexend600" if F_LX6 else "Helvetica"
def P4(): return "Plex400" if F_P4 else "Helvetica"
def P5(): return "Plex500" if F_P5 else "Helvetica"
def P6(): return "Plex600" if F_P6 else "Helvetica-Bold"
def AR(): return "PlexArabic" if F_AR else "Helvetica"

def ar_shape(s):
    return bidi.get_display(arabic_reshaper.reshape(s)) if F_AR else s

MM = 2.83465
W, H = 595.28, 841.89
ML = MR = 15 * MM
MT = 18 * MM
MB = 16 * MM
UW = W - ML - MR

# ── C2 STADIUM-D mark (byte-identical to src/brand/brandmark.ts) ───────────
_bm = None
_d = os.path.abspath(ROOT)
for _ in range(6):
    _cand = os.path.join(_d, "src/brand/brandmark.ts")
    if os.path.exists(_cand):
        _bm = _cand
        break
    if _d == os.path.dirname(_d):
        break
    _d = os.path.dirname(_d)
if not _bm:
    raise SystemExit("brandmark.ts not found above " + str(ROOT))
ts = open(_bm).read()
MARK = re.search(r'mark:\s*"([^"]+)"', ts).group(1)

def _arc_cubics(x0, y0, r, x1, y1, sweep, large):
    mx, my = (x0 - x1) / 2, (y0 - y1) / 2
    d = math.hypot(mx, my)
    if d == 0:
        return []
    f = -1.0 if (large == sweep) else 1.0
    r2 = r * r
    val = (r2 * r2 - r2 * my * my - r2 * mx * mx) / (r2 * mx * mx + r2 * my * my)
    if val < 0: val = 0.0
    rc = f * math.sqrt(val)
    cx = rc * my + (x0 + x1) / 2
    cy = -rc * mx + (y0 + y1) / 2
    a0 = math.atan2(y0 - cy, x0 - cx)
    a1 = math.atan2(y1 - cy, x1 - cx)
    da = a1 - a0
    if sweep and da < 0: da += 2 * math.pi
    if not sweep and da > 0: da -= 2 * math.pi
    n = max(1, int(math.ceil(abs(da) / (math.pi / 2))))
    out = []
    for i in range(n):
        s = a0 + da * i / n
        e = a0 + da * (i + 1) / n
        k = 4 / 3 * math.tan((e - s) / 4)
        c1x, c1y = cx + r * math.cos(s) - k * r * math.sin(s), cy + r * math.sin(s) + k * r * math.cos(s)
        c2x, c2y = cx + r * math.cos(e) + k * r * math.sin(e), cy + r * math.sin(e) - k * r * math.cos(e)
        out.append((c1x, c1y, c2x, c2y, cx + r * math.cos(e), cy + r * math.sin(e)))
    return out

def parse_mark_path(d):
    toks = re.findall(r"[MHLAVZ]|[-+]?(?:\d+\.?\d*|\.\d+)", d)
    subs, cur, i = [], [], 0
    while i < len(toks):
        t = toks[i]
        if t == "M":
            if cur: subs.append(cur)
            cur = [("M", float(toks[i+1]), float(toks[i+2]))]
            i += 3
        elif t == "H": cur.append(("H", float(toks[i+1]))); i += 2
        elif t == "V": cur.append(("V", float(toks[i+1]))); i += 2
        elif t == "L": cur.append(("L", float(toks[i+1]), float(toks[i+2]))); i += 3
        elif t == "A":
            rx = float(toks[i+1]); la = int(toks[i+3]); sw = int(toks[i+4])
            x1, y1 = float(toks[i+5]), float(toks[i+6])
            cur.append(("A", rx, la, sw, x1, y1)); i += 7
        elif t == "Z":
            subs.append(cur); cur = []; i += 1
        else:
            i += 1
    if cur: subs.append(cur)
    return subs

MARK_SUBS = parse_mark_path(MARK)

def draw_mark(c, tx, ty, scale, color):
    p = c.beginPath()
    for sub in MARK_SUBS:
        lx = ly = None
        for el in sub:
            k = el[0]
            if k == "M":
                lx, ly = el[1], el[2]
                p.moveTo(tx + scale * lx, ty - scale * ly)
            elif k == "L":
                lx, ly = el[1], el[2]
                p.lineTo(tx + scale * lx, ty - scale * ly)
            elif k == "H":
                lx = el[1]; p.lineTo(tx + scale * lx, ty - scale * ly)
            elif k == "V":
                ly = el[1]; p.lineTo(tx + scale * lx, ty - scale * ly)
            elif k == "A":
                rx = el[1]; la = el[2]; sw = el[3]; x1, y1 = el[4], el[5]
                for (c1x, c1y, c2x, c2y, ex, ey) in _arc_cubics(lx, ly, rx, x1, y1, sw, la):
                    p.curveTo(tx + scale * c1x, ty - scale * c1y, tx + scale * c2x, ty - scale * c2y, tx + scale * ex, ty - scale * ey)
                lx, ly = x1, y1
        p.close()
    c.saveState()
    c.setFillColor(color)
    c.drawPath(p, stroke=0, fill=1, fillMode=0)  # evenodd
    c.restoreState()

def circle(c, cx, cy, r, w=None, color=None, fill=None):
    k = 0.5522847498
    p = c.beginPath()
    p.moveTo(cx + r, cy)
    p.curveTo(cx + r, cy + k * r, cx + k * r, cy + r, cx, cy + r)
    p.curveTo(cx - k * r, cy + r, cx - r, cy + k * r, cx - r, cy)
    p.curveTo(cx - r, cy - k * r, cx - k * r, cy - r, cx, cy - r)
    p.curveTo(cx + k * r, cy - r, cx + r, cy - k * r, cx + r, cy)
    p.close()
    c.saveState()
    if w is not None:
        c.setStrokeColor(color); c.setLineWidth(w)
    if fill is not None:
        c.setFillColor(fill)
    c.drawPath(p, stroke=1 if w is not None else 0, fill=1 if fill is not None else 0)
    c.restoreState()

def arc_text(c, cx, cy, r, text, font, size, spacing=0.0, side="top", color=None):
    c.saveState()
    if color: c.setFillColor(color)
    c.setFont(font, size)
    adv = [pdfmetrics.stringWidth(ch, font, size) + spacing for ch in text]
    total = sum(adv)
    span = total / r
    base = math.pi / 2 if side == "top" else 3 * math.pi / 2
    for i, ch in enumerate(text):
        cum = sum(adv[:i]) + adv[i] / 2
        if side == "top":
            theta = base + span / 2 - cum / r
            rot = math.degrees(theta - math.pi / 2)
        else:
            theta = base - span / 2 + cum / r
            rot = math.degrees(theta + math.pi / 2)
        x = cx + r * math.cos(theta)
        y = cy + r * math.sin(theta)
        c.saveState()
        c.translate(x, y); c.rotate(rot)
        c.drawString(-pdfmetrics.stringWidth(ch, font, size) / 2, 0, ch)
        c.restoreState()
    c.restoreState()

def tw(s, font, size, letter=0.0):
    return pdfmetrics.stringWidth(s, font, size) + letter * max(0, len(s) - 1)

def text(c, x, y, s, font, size, color=None, align="left", letter=0.0):
    c.saveState()
    if color: c.setFillColor(color)
    c.setFont(font, size)
    w = tw(s, font, size, letter)
    if align == "right": x = x - w
    elif align == "center": x = x - w / 2
    if letter:
        cx = x
        for ch in s:
            c.drawString(cx, y, ch)
            cx += pdfmetrics.stringWidth(ch, font, size) + letter
    else:
        c.drawString(x, y, s)
    c.restoreState()
    return w

def wrap(c, s, font, size, width):
    words = s.split(" ")
    lines, cur = [], ""
    for w_ in words:
        t = (cur + " " + w_).strip()
        if pdfmetrics.stringWidth(t, font, size) <= width:
            cur = t
        else:
            if cur: lines.append(cur)
            cur = w_
    if cur: lines.append(cur)
    return lines

def para(c, x, y, s, font, size, width, color=None, leading=1.42):
    for ln in wrap(c, s, font, size, width):
        text(c, x, y, ln, font, size, color)
        y -= size * leading
    return y

# ── stamp vector renderers (geometry = scripts/identity-stamp.mjs) ─────────
def draw_stamp_A(c, cx, cy, mm, color, reserved=False):
    S = (mm / 45.0) * 0.283465
    circle(c, cx, cy, 222 * S, w=6 * S, color=color)
    circle(c, cx, cy, 152 * S, w=4 * S, color=color)
    circle(c, cx - 187 * S, cy, 5 * S, color=color, fill=color)
    circle(c, cx + 187 * S, cy, 5 * S, color=color, fill=color)
    arc_text(c, cx, cy, 178 * S, "SARL FEL DRONE", LX7(), (28 / 0.7) * S, spacing=4 * S, side="top", color=color)
    arc_text(c, cx, cy, 214 * S, "150 LOGEMENTS, COMMUNE AÏN EL ASSEL", P5(), (15 / 0.65) * S, spacing=0.5 * S, side="bottom", color=color)
    arc_text(c, cx, cy, 186 * S, "RC 36/00-0683602B26 · WILAYA D'EL TARF", P5(), (12 / 0.65) * S, spacing=0.5 * S, side="bottom", color=color)
    if reserved:
        for dy, lab in ((316, "NIF"), (340, "NIS")):
            yy = cy + (225 - dy) * S
            text(c, cx - 24 * S, yy, lab, P5(), (13 / 0.65) * S, color, letter=1.5 * S)
            c.saveState()
            c.setStrokeColor(color); c.setLineWidth(0.6 * S); c.setDash(1.2 * S, 1.2 * S)
            c.line(cx - 8 * S, yy - 1.5 * S, cx + 48 * S, yy - 1.5 * S)
            c.restoreState()
    ms = 0.93
    draw_mark(c, cx - 80 * ms * S, cy + 74 * ms * S, ms * S, color)

def draw_stamp_B(c, cx, cy, mm, color):
    S = (mm / 50.0) * 0.283465
    circle(c, cx, cy, 240 * S, w=5 * S, color=color)
    arc_text(c, cx, cy, 192 * S, "FEL DRONE", LX7(), (40 / 0.7) * S, spacing=10 * S, side="top", color=color)
    arc_text(c, cx, cy, 226 * S, "RC 36/00-0683602B26", P6(), (22 / 0.65) * S, spacing=4 * S, side="bottom", color=color)
    text(c, cx, cy + (250 - 352) * S, "EL TARF — ALGÉRIE", P5(), (16 / 0.65) * S, color, align="center", letter=5 * S)
    draw_mark(c, cx - 80 * S, cy + 74 * S, S, color)

def draw_stamp_C(c, cx, cy, mm, color):
    S = (mm / 30.0) * 0.283465
    circle(c, cx, cy, 143 * S, w=5 * S, color=color)
    arc_text(c, cx, cy, 112 * S, "FEL DRONE", LX7(), (26 / 0.7) * S, spacing=4 * S, side="top", color=color)
    arc_text(c, cx, cy, 131 * S, "RC 36/00-0683602B26", P6(), (16 / 0.65) * S, spacing=1.5 * S, side="bottom", color=color)
    ms = 0.5
    draw_mark(c, cx - 80 * ms * S, cy + 74 * ms * S, ms * S, color)

def lockup_width(mark_size):
    s = mark_size / 160
    return 176 * s + 40 * s + tw("FEL DRONE", LX7(), 110 * s / 0.7, 0.06 * (110 * s / 0.7))

def draw_lockup(c, x, y_bottom, mark_size, color=NAVY):
    s = mark_size / 160
    # 176u box: mark occupies local y 20..160 → PDF y [y_bottom+16s, y_bottom+156s]
    draw_mark(c, x, y_bottom + 160 * s, s, color)
    fs = 110 * s / 0.7
    text(c, x + 176 * s + 40 * s, y_bottom + 31 * s, "FEL DRONE", LX7(), fs, color, letter=0.06 * fs)
    return lockup_width(mark_size)

def wrap_tokens(tokens, c, width, size):
    """tokens: [(word, fontname)] — wrap into lines."""
    lines, cur, curw = [], [], 0.0
    spacew = pdfmetrics.stringWidth(" ", P4(), size)
    for w_, f_ in tokens:
        ww = pdfmetrics.stringWidth(w_, f_(), size) if callable(f_) else pdfmetrics.stringWidth(w_, f_, size)
        add = ww if not cur else ww + spacew
        if curw + add <= width or not cur:
            cur.append((w_, f_))
            curw += add
        else:
            lines.append(cur)
            cur = [(w_, f_)]
            curw = ww
    if cur: lines.append(cur)
    return lines

def draw_tokens_line(c, x, y, tokens, size, color=None):
    for w_, f_ in tokens:
        f = f_() if callable(f_) else f_
        text(c, x, y, w_, f, size, color)
        x += pdfmetrics.stringWidth(w_, f, size) + pdfmetrics.stringWidth(" ", P4(), size)
    return x

# ── document ───────────────────────────────────────────────────────────────
class Doc:
    def __init__(self, path, total_pages):
        self.c = canvas.Canvas(path, pagesize=(W, H), invariant=1)
        self.c.setTitle("FEL DRONE — Corporate Identity Review (Phase 2) — DRAFT")
        self.c.setAuthor("FEL DRONE (SARL)")
        self.c.setSubject("Complete corporate identity review: stamp/cachet system, concepts A/B/C, size & ink simulations, document simulations, manufacturing constraints, invoice reference — DRAFT, human review required")
        self.y = H - MT
        self.n = 1
        self.total = total_pages

    def _furniture(self):
        c = self.c
        if self.n > 1:
            c.saveState()
            c.setStrokeColor(LINE); c.setLineWidth(0.7)
            c.line(ML, H - MT + 8, W - MR, H - MT + 8)
            c.restoreState()
            text(c, ML, H - MT + 14, "FEL DRONE — Corporate Visual Identity System · Phase 2", P5(), 7.5, GRAY, letter=0.4)
            text(c, W - MR, H - MT + 14, "DRAFT — Human Review Required", P6(), 7.5, ACCENT, align="right", letter=0.4)
        c.saveState()
        c.setStrokeColor(LINE); c.setLineWidth(0.7)
        c.line(ML, MB - 10, W - MR, MB - 10)
        c.restoreState()
        text(c, ML, MB - 19, "FEL DRONE — SARL · RC 36/00-0683602B26 · NIF 0236068360293 · NIS : À COMPLÉTER · AI : À COMPLÉTER · 36010 Algérie", P4(), 6.8, GRAY)
        text(c, W - MR, MB - 19, f"Page {self.n} / {self.total}", P5(), 7.5, GRAY, align="right")

    def _new_page(self):
        if self.n > 1:
            self._furniture()
            self.c.showPage()
        self.n += 1
        self.y = H - MT

    def ensure(self, h):
        if self.y - h < MB + 24:
            self._new_page()

    def finish(self):
        self._furniture()
        self.c.showPage()
        self.c.save()

    def section(self, num, title, tag, new_page=True):
        if new_page:
            if self.n == 1:
                self._furniture()
                self.c.showPage()
                self.n = 2
                self.y = H - MT
            else:
                self._new_page()
        else:
            self.ensure(90)
        c = self.c
        self.y -= 26
        c.saveState()
        c.setFillColor(NAVY)
        c.rect(ML, self.y - 4, 20, 14, stroke=0, fill=1)
        c.restoreState()
        text(c, ML + 28, self.y, num, LX7(), 12, ACCENT)
        text(c, ML + 50, self.y, title, LX7(), 14, NAVY, letter=0.3)
        ttw = tw(title, LX7(), 14, 0.3)
        text(c, ML + 50 + ttw + 12, self.y + 1, tag, P5(), 7.8, GRAY, letter=0.3)
        c.saveState()
        c.setStrokeColor(LINE2); c.setLineWidth(1)
        c.line(ML, self.y - 12, W - MR, self.y - 12)
        c.restoreState()
        self.y -= 30

    def sub(self, s, size=10.5):
        self.ensure(30)
        self.y -= 10
        text(self.c, ML, self.y, s, LX6(), size, NAVY, letter=0.2)
        self.y -= size + 6

    def body(self, s, size=8.6, color=None, width=None, leading=1.45):
        lines = wrap(self.c, s, P4(), size, width or UW)
        self.ensure(len(lines) * size * leading + 6)
        y = self.y
        for ln in lines:
            text(self.c, ML, y, ln, P4(), size, color)
            y -= size * leading
        self.y = y + 4

    def kv_table(self, headers, rows, widths, size=7.8, pad=5.5, head_h=15):
        c = self.c
        total_w = sum(widths)
        AR_RE = re.compile(r"[\u0600-\u06FF]")
        def cell_parts(cell, i):
            """[(font, text, align)] — splits French + Arabic in one cell."""
            fname = P6() if i == 0 else P4()
            m = AR_RE.search(cell)
            if not m:
                return [(fname, cell, "left")]
            pre, ar = cell[:m.start()].rstrip(), cell[m.start():]
            if pre.endswith("("):  # fold paren into the RTL run
                pre = pre[:-1].rstrip()
                ar = "(" + ar
            parts = []
            if pre:
                parts.append((fname, pre, "left"))
            parts.append((AR(), ar, "right"))
            return parts
        RICH_RE = re.compile(r"[→≥]")
        def rich_tokens(cell, default_font):
            toks = []
            for i2, part in enumerate(re.split(r"(→|≥)", cell)):
                if not part:
                    continue
                if part in ("→", "≥"):
                    toks.append((part, ARW))
                else:
                    toks.extend((w_, default_font) for w_ in part.split(" ") if w_)
            return toks
        def row_h(cells):
            lines = 1
            for i, cell in enumerate(cells):
                if RICH_RE.search(cell) and not AR_RE.search(cell):
                    n = len(wrap_tokens(rich_tokens(cell, P6() if i == 0 else P4()), c, widths[i] - 10, size))
                else:
                    n = 0
                    for font, part, _ in cell_parts(cell, i):
                        n += len(wrap(c, ar_shape(part) if font == "PlexArabic" else part, font, size, widths[i] - 10))
                lines = max(lines, n)
            return lines * size * 1.35 + pad * 2
        h = head_h + sum(row_h(r) for r in rows)
        self.ensure(h + 8)
        y = self.y
        c.saveState()
        c.setFillColor(NAVY)
        c.rect(ML, y - head_h, total_w, head_h, stroke=0, fill=1)
        c.restoreState()
        x = ML
        for i, htxt in enumerate(headers):
            text(c, x + 5, y - head_h + 4.5, htxt, P6(), size - 0.4, white, letter=0.3)
            x += widths[i]
        y -= head_h
        seg_top = y
        for r in rows:
            rh = row_h(r)
            if y - rh < MB + 24:
                c.saveState()
                c.setStrokeColor(LINE2); c.setLineWidth(0.8)
                c.rect(ML, y, total_w, seg_top - y, stroke=1, fill=0)
                c.restoreState()
                self._furniture()
                c.showPage()
                self.n += 1
                y = H - MT
                seg_top = y
            c.saveState()
            c.setStrokeColor(LINE); c.setLineWidth(0.5)
            c.line(ML, y - rh, ML + total_w, y - rh)
            c.restoreState()
            x = ML
            for i, cell in enumerate(r):
                yy = y - pad - size * 0.9
                if RICH_RE.search(cell) and not AR_RE.search(cell):
                    for ln in wrap_tokens(rich_tokens(cell, P6() if i == 0 else P4()), c, widths[i] - 10, size):
                        draw_tokens_line(c, x + 5, yy, ln, size, INK if i == 0 else GRAY)
                        yy -= size * 1.35
                else:
                    for font, part, align in cell_parts(cell, i):
                        for ln in wrap(c, ar_shape(part) if font == "PlexArabic" else part, font, size, widths[i] - 10):
                            text(c, x + (widths[i] - 5) if align == "right" else x + 5, yy, ln, font, size, INK if i == 0 else GRAY, align=align)
                            yy -= size * 1.35
                x += widths[i]
            y -= rh
        c.saveState()
        c.setStrokeColor(LINE2); c.setLineWidth(0.8)
        c.rect(ML, y, total_w, seg_top - y, stroke=1, fill=0)
        c.restoreState()
        self.y = y - 10

AR_ADDR = "حي 150 مسكن، بلدية عين العسل، ولاية الطارف"
AR_NAME = "الاسم العربي للشركة غير متوفر في المشروع"

# ══ CONTENT (verbatim from the current preview) ════════════════════════════
COMPANY = [
    ("Company name", "SARL FEL DRONE (legal) · FEL DRONE (short)", False),
    ("Forme", "SARL", False),
    ("Capital social", "1 000 000 DA", False),
    ("RC", "36/00-0683602B26", False),
    ("NIF", "0236068360293", False),
    ("NIS", "À COMPLÉTER — DATA REQUIRED FROM COMPANY", True),
    ("AI", "À COMPLÉTER — DATA REQUIRED FROM COMPANY", True),
    ("Siège social", "150 Logements, Commune d'Aïn El Assel, Wilaya d'El Tarf — 36010 Algérie", False),
    ("Téléphone fixe / mobile", "044436684 · 0661613399", False),
    ("E-mail / site", "contact.feldrone@gmail.com · feldrone.dz", False),
]
SOURCES = [
    ("[LEGAL SOURCE] Décret exécutif n° 05-468 du 10 décembre 2005 (JO N°80 du 11/12/2005) — commerce.gov.dz/fr/reglementation/decret-executif-n05-468",
     "Mentions obligatoires sur la facture, le bon de livraison et la facture récapitulative — vendeur : raison sociale, adresse, NIF, NIS, RC, AI, n° de facture, date, client, désignation, HT/TVA/TTC. (Secondary interpretation: the devis carries the same mentions.)"),
    ("[LEGAL SOURCE] CNRC / Sidjilcom — sidjilcom.cnrc.dz",
     "Registre de commerce = official commercial registration (legal existence of the company). The extract records dénomination, forme juridique, adresse, capital, activité, gérance."),
    ("[LEGAL SOURCE] DGI (Ministère des Finances) — mf.gov.dz / nifenligne.mf.gov.dz",
     "NIF = tax identification number (15/20 digits), issued by DGI, mandatory on invoices and fiscal declarations."),
    ("[LEGAL SOURCE] ONS (Office National des Statistiques)",
     "NIS = statistical identification number, issued after NIF, mandatory on invoices for legal entities."),
    ("Algerian professional practice (e-invoicing platforms, company-formation guides)",
     "Physical/digital company stamp (“cachet”) is the standard authentication element on invoices & letters; “une facture sans cachet ne passe pas”. Practice — not a legal text."),
]
FIELDS = [
    ("Company name", "SARL FEL DRONE (legal name) · FEL DRONE (short) · Concept A top arc renders SARL FEL DRONE in gras/bold (Lexend 700 — company clarification 2026-09-18: “gras” = bold weight, not text content; B/C keep FEL DRONE)", "B — Recommended", "Legally required on the invoice (D.E. 05-468) [LEGAL SOURCE]; on the stamp: professional practice. Concept A shows the real company name in bold — no abbreviation or substitute text."),
    ("RC", "36/00-0683602B26 (character-for-character, as issued)", "B — Recommended", "Primary legal identifier (CNRC); mandatory on the invoice [LEGAL SOURCE]; on the stamp: practice."),
    ("Address", f"Cité 150 Logements B, Aïn El Assel, El Tarf (repo) — headquarters form approved by the company 2026-09-18: 150 LOGEMENTS, COMMUNE D'AÏN EL ASSEL, WILAYA D'EL TARF ({AR_ADDR})", "B — Recommended", "Required on the invoice [LEGAL SOURCE]; on the stamp: practice. Concept A arc form (review correction 2026-09-18): outer arc 150 LOGEMENTS, COMMUNE AÏN EL ASSEL · inner arc RC … · WILAYA D'EL TARF. The district is typeset as “150 Logements” — no additional address information."),
    ("NIF", "— not in repo — Data required", "Data required", "Legally required on invoices [LEGAL SOURCE]. Stamp slot reserved (Concept A “rsvd” variants). Must be provided by the company — never fabricated."),
    ("NIS", "— not in repo — Data required", "Data required", "As NIF (ONS). Stamp slot reserved. DATA REQUIRED FROM COMPANY."),
    ("AI (article d'imposition)", "— not in repo — Data required", "Data required", "Optional on stamp. Invoice mention (local tax office). Not needed on the stamp; only if the company wants it."),
    ("Phone", "+213 6 61 61 33 99", "C — Optional", "Verified in repo. Excluded from the stamp by design (legibility at 30–45 mm)."),
    ("Email / website", "contact.feldrone@gmail.com · feldrone.dz", "C — Optional", "Verified in repo. Excluded from the stamp by design."),
    ("Capital", "1 000 000 DA (repo: “internal record only”)", "C — Optional", "Verified but flagged internal-only in company.ts. Not placed on the stamp by default — human decision if it should appear."),
    ("Arabic company name", "— not verified — Data required", "Data required", "The site's Arabic UI uses the Latin name “FEL DRONE” inside Arabic copy. No verified Arabic denomination exists in the repo — not invented. A bilingual variant can be cut once the verified Arabic name is provided (top-arc slot geometry is ready)."),
]
SPECS = [
    ("A — Classic Corporate", [
        ("Structure", "Company name SARL FEL DRONE (top, Lexend 700, gras/bold) · address district + commune (bottom arc 1) · RC + wilaya (bottom arc 2) · dots · mark. Reserved: NIF/NIS lines under mark."),
        ("Size", "45 mm master (also cut at 40/50 mm)."),
        ("Typography", "Name in Lexend 700 (approved FEL DRONE wordmark face, cap 2.8 mm). Legal lines in IBM Plex Sans 500 — address 1.5 mm, RC·wilaya 1.2 mm."),
        ("Manufacturing", "Rings 0.6/0.4 mm · name cap 2.8 mm · address 1.5 mm · RC·wilaya 1.2 mm · dots Ø1.0 mm · mark 12.6 mm ink, scale 0.93 (fill-rule:evenodd). Mono black."),
        ("Advantages", "Most complete identification; reads as an established Algerian company stamp; reserved NIF/NIS slot = no re-cut when data arrives."),
        ("Risks", "RC·wilaya arc at 1.2 mm cap is the finest text — at 30 mm it is below the minimum (hence 45 mm recommended); do not scale A below 40 mm."),
        ("Status", "Draft — human review required"),
    ]),
    ("B — Modern Corporate", [
        ("Structure", "Short name (top, Lexend 700) · RC (bottom) · city line under mark."),
        ("Size", "50 mm master (also cut at 45 mm)."),
        ("Typography", "Name in Lexend 700 (approved wordmark face, cap 4.0 mm, wide tracking). RC + city in IBM Plex Sans (2.2 / 1.6 mm)."),
        ("Manufacturing", "Ring 0.5 mm · name cap 4.0 mm · RC 2.2 mm · city 1.6 mm · mark 13.6 mm ink, scale 1.00 (fill-rule:evenodd). Mono black."),
        ("Advantages", "Cleanest at a distance; largest mark of the family; strong on modern document layouts (reports, quotes)."),
        ("Risks", "Carries less identification data than A — address absent; if the counterparty expects address on the stamp, choose A."),
        ("Status", "Draft — human review required"),
    ]),
    ("C — Compact Official", [
        ("Structure", "Short name (top, Lexend 700) · RC (bottom) · mark only."),
        ("Size", "30 mm master (up to 40 mm max)."),
        ("Typography", "Name in Lexend 700 (approved wordmark face, cap 2.6 mm). RC in IBM Plex Sans (1.6 mm)."),
        ("Manufacturing", "Ring 0.5 mm · name cap 2.6 mm · RC 1.6 mm · mark 6.8 mm ink, scale 0.50 (fill-rule:evenodd). All strokes ≥ 0.5 mm at 30 mm."),
        ("Advantages", "Best for frequent stamping and narrow document margins; cheapest to produce; survives photocopy at 30 mm."),
        ("Risks", "Least information — fine for internal/quick use, not the primary invoice stamp if A/B is chosen for that role."),
        ("Status", "Draft — human review required"),
    ]),
]
MFR = [
    ("Master files", "public/brand-review/stamp/assets/*.svg (vector, mono black, 10 viewBox units = 1 mm). Regenerate with node scripts/identity-stamp.mjs. MANIFEST.json carries SHA-256 of every file."),
    ("Minimum stroke", "≥ 0.4 mm (Concepts A/B/C all comply; C is designed at 30 mm so its 0.5 mm ring holds)."),
    ("Typography", "Company name/wordmark in Lexend 700 (the approved FEL DRONE wordmark face — never IBM Plex for the name). Legal/data lines (address, RC, wilaya, city) in IBM Plex Sans, the approved body face."),
    ("Minimum text", "Cap height ≥ 1.2 mm (A's RC·wilaya line — only at 45 mm); name/address lines 1.5–4.0 mm. Never below 1.2 mm for any cut size."),
    ("Letter spacing", "Baked into the vector (0.05–1.0 mm equivalent per concept); the cutter sets text as outlines, no kerning at cut time."),
    ("Negative space", "Clearest gap in the family: A's ring-to-text ≥ 2 mm at 45 mm; no detail denser than the mark's own r12 counter."),
    ("Ink spread", "Simulated at ~0.15 mm (section 05). Keep ring ≥ 0.4 mm so a 0.2 mm spread never closes the ring-to-text gap."),
    ("Photocopy / scan", "All concepts use solid ≥ 0.4 mm ink at 100 % density → survive A4 photocopy and scanning at 300 dpi (verified by geometry: no element < 0.4 mm)."),
    ("Reproduction", "Black mono only for the physical stamp. Navy variant = presentation. No gradients, no shadows, no hairlines — by construction."),
    ("Material", "Suggested (not specified): self-inking round stamp (45/50 mm) for office use; classic rubber + acrylic handle for the 30 mm daily stamp."),
]

def build(path, total_pages):
    d = Doc(path, total_pages)
    c = d.c

    # ═══ PAGE 1 — COVER ═══
    y = d.y
    c.saveState()
    c.setFillColor(NAVY)
    c.rect(0, H - 8, W, 8, stroke=0, fill=1)
    c.restoreState()
    y -= 34
    lm = 16 * MM
    draw_lockup(c, ML, y, lm, NAVY)
    y -= lm * 1.1 + 16
    c.saveState()
    c.setFillColor(ACCENT)
    c.rect(ML, y, 64, 2.2, stroke=0, fill=1)
    c.restoreState()
    y -= 22
    text(c, ML, y, "Official Corporate Stamp / Cachet", LX7(), 25, NAVY)
    y -= 28
    text(c, ML, y, "— Design Family", LX7(), 25, NAVY)
    y -= 18
    pre = "Corporate Visual Identity System · Phase 2 — complete review document (preview "
    text(c, ML, y, pre, P5(), 10, GRAY)
    ax = ML + tw(pre, P5(), 10)
    c.saveState()
    c.setStrokeColor(GRAY); c.setLineWidth(1.1)
    c.line(ax, y + 3, ax + 9, y + 3)
    c.line(ax + 9, y + 3, ax + 5.5, y + 5.5)
    c.line(ax + 9, y + 3, ax + 5.5, y + 0.5)
    c.restoreState()
    text(c, ax + 13, y, "PDF)", P5(), 10, GRAY)
    y -= 30
    meta = [
        ("Branch", "brand/corporate-stamp", False),
        ("Base", "main 59fbd8f (production untouched)", False),
        ("Prepared", "2026-09-18", False),
        ("Rendered build", "9571478 — company name SARL FEL DRONE, Lexend 700 gras", False),
        ("Status", "DRAFT — HUMAN REVIEW REQUIRED", True),
    ]
    c.saveState()
    c.setFillColor(BG)
    c.rect(ML, y - 5 * 15 - 12, UW, 5 * 15 + 16, stroke=0, fill=1)
    c.restoreState()
    for i, (k, v, acc) in enumerate(meta):
        yy = y - 10 - i * 15
        text(c, ML + 12, yy, k, P5(), 8.2, GRAY)
        text(c, ML + 110, yy, v, P6(), 8.2, ACCENT if acc else INK)
    y -= 5 * 15 + 16 + 20
    text(c, ML, y, "COMPANY IDENTITY (single source: src/data/company.ts + company-provided data)", LX6(), 8.5, NAVY, letter=0.5)
    y -= 15
    for lab, val, acc in COMPANY:
        text(c, ML + 118, y, lab, P4(), 8.4, GRAY, align="right")
        text(c, ML + 126, y, val, P6(), 8.4, ACCENT if acc else INK)
        y -= 13.4
    y -= 12
    text(c, ML, y, "CONTENTS", LX6(), 8.5, NAVY, letter=0.5)
    y -= 15
    toc = [
        ("01", "Approved Logo — unchanged source", "V12 “C2 STADIUM-D”"),
        ("02", "Legal-Information Analysis — Algeria", "read-only research · 2026-09-18"),
        ("03", "Stamp Concepts — rendered", "3 concepts · per-concept review sheets"),
        ("04", "Physical-Size Simulation", "true scale · 30 / 40 / 45 / 50 mm"),
        ("05", "Ink Simulation", "black master · navy presentation"),
        ("06", "Document Simulation", "visual simulation only"),
        ("07", "Manufacturing Constraints", "for the cutter / stamp maker"),
        ("08", "Invoice Template — Reference (FACTURE)", "cachet & signature zone"),
    ]
    for num, t_, tag in toc:
        text(c, ML, y, num, LX7(), 9, ACCENT)
        text(c, ML + 22, y, t_, P6(), 8.6, INK)
        text(c, W - MR, y, tag, P4(), 7.8, GRAY, align="right")
        c.saveState()
        c.setStrokeColor(LINE); c.setLineWidth(0.5)
        c.line(ML, y - 5, W - MR, y - 5)
        c.restoreState()
        y -= 17
    d.y = y

    # ═══ §01 ═══
    d.section("01", "Approved Logo — unchanged source", "V12 “C2 STADIUM-D”")
    d.sub("Symbol — V12 C2 STADIUM-D")
    ms = 30 * MM
    d.ensure(ms + 40)
    top = d.y
    cy_ = top - ms / 2 - 6
    draw_mark(c, ML + 10 - 80 * (ms / 160), cy_ + 74 * (ms / 160), ms / 160, NAVY)
    yy = para(c, ML + ms + 24, top - 12,
        "160×160, 2u grid, D-plate whose structure is the F, r14 rotor pod. The approved final mark (docs/BRAND.md, human-approved). Rendered here in vector with fill-rule:evenodd — the exact rule of the approved website rendering (src/components/Logo.tsx), which preserves the C2 counters (the F structure) as negative space.",
        P4(), 8.6, UW - ms - 34)
    d.y = min(cy_ - ms / 2 - 12, yy - 4)
    d.sub("Horizontal lockup — 1157×176")
    d.ensure(70)
    lw2 = 12 * MM
    draw_lockup(c, ML, d.y - 4 - lw2 * 1.1, lw2, NAVY)
    d.y -= lw2 * 1.1 + 10
    d.body("Mark + Lexend 700 wordmark. Production rendering: src/components/Logo.tsx from generated data (src/brand/brandmark.ts).")
    d.sub("Mono build")
    d.ensure(70)
    ms2 = 18 * MM
    top = d.y
    cy2 = top - ms2 / 2 - 4
    draw_mark(c, ML + 10 - 80 * (ms2 / 160), cy2 + 74 * (ms2 / 160), ms2 / 160, INK)
    yy = para(c, ML + ms2 + 24, top - 12,
        "One flat ink, no strokes, gradients or effects — the material language of a stamp. All three concepts embed the approved mark unchanged (extracted from brandmark.ts by the generator — never redrawn).",
        P4(), 8.6, UW - ms2 - 34)
    d.y = min(cy2 - ms2 / 2 - 10, yy - 4)
    d.ensure(96)
    hb = 80
    c.saveState()
    c.setFillColor(BG)
    c.rect(ML, d.y - hb, UW, hb, stroke=0, fill=1)
    c.setFillColor(ACCENT)
    c.rect(ML, d.y - hb, 2, hb, stroke=0, fill=1)
    c.restoreState()
    text(c, ML + 12, d.y - 15, "INTEGRITY", LX6(), 8.5, NAVY, letter=0.5)
    yy = d.y - 30
    yy = para(c, ML + 12, yy, "The mark path in every stamp SVG is byte-identical to the production BRAND.mark (extracted by scripts/identity-stamp.mjs at generation time; the production asset remains gated by npm run brand:check). No redesign, no reinterpretation, no new geometry added to the mark.", P4(), 8.2, UW - 28, INK)
    yy = para(c, ML + 12, yy - 2, "Rendered with fill-rule:evenodd — exactly the rule the approved website rendering uses (src/components/Logo.tsx) — which is what preserves the C2 counters (the F structure) as negative space in the stamp reproduction.", P4(), 8.2, UW - 28, INK)
    d.y = d.y - hb - 16

    # ═══ §02 ═══
    d.section("02", "Legal-Information Analysis — Algeria", "read-only research · 2026-09-18")
    d.ensure(130)
    c.saveState()
    c.setFillColor(BG)
    c.rect(ML, d.y - 66, UW, 66, stroke=0, fill=1)
    c.restoreState()
    yy = d.y - 14
    yy = para(c, ML + 10, yy, "Headline finding [VERIFIED]: no Algerian legal text prescribes the content of a physical company stamp (tampon / cachet). The obligation to carry company-identification mentions attaches to the document (the invoice), not to the stamp. The stamp is professional practice: Algerian business usage treats it as the expected authentication element on invoices and letters, and administrative procedures (e.g. the NIF/NIS dossiers) ask for the “cachet de l’entreprise”.", P5(), 8.2, UW - 22, INK)
    yy = para(c, ML + 10, yy, "Consequently, no field below is legally mandatory on the physical stamp itself — the classes A/B/C reflect (A) legally established identifiers on documents, (B) professional stamp practice, (C) brand value-add.", P4(), 8.2, UW - 22, GRAY)
    d.y = d.y - 66 - 12
    d.sub("Authoritative sources checked")
    d.kv_table(["Source", "Establishes"], SOURCES, [215, UW - 215], size=7.7)
    d.sub("Field classification (values verified in repo src/data/company.ts — single source of company identity)")
    d.kv_table(["Field", "Verified value", "Class", "Basis"], FIELDS, [60, 165, 52, UW - 277], size=7.4)
    d.sub("Language decision (for review)")
    d.body("Primary: French. All verified legal identifiers are French-form (RC, SARL, French address); the company's documents and invoice mentions are French per the regulatory regime.")
    d.ensure(30)
    d.body("Arabic: official language of Algeria — a bilingual stamp is professionally justified, but the verified Arabic company name is not in the repo:", size=8.6)
    y_ = d.y
    text(c, W - MR, y_, ar_shape("(" + AR_NAME + ")"), AR(), 9, INK, align="right")
    d.y = y_ - 15
    d.body("Transliterating it would be fabrication. The concepts therefore ship French; the top-arc geometry of Concepts A/B accepts the Arabic name as a drop-in replacement (same arc, RTL set) once provided. Full duplication of every field in two languages was rejected: it halves the legible text budget and is not required by any source found.")

    # ═══ §03 ═══
    d.section("03", "Stamp Concepts — rendered", "3 concepts · DRAFT")
    sz = 52 * MM
    d.ensure(sz + 130)
    d.sub("Concept A — Classic Corporate")
    text(c, ML, d.y, "Intended use: invoices, official letters, administrative dossiers · Recommended size: 45 mm", P5(), 8.4, GRAY)
    d.y -= 14
    d.ensure(sz + 44)
    draw_stamp_A(c, ML + sz / 2, d.y - sz / 2 - 2, 52, INK)
    d.y -= sz + 6
    d.body("A1 — manufacturing master. Black on white. Double ring (0.6 / 0.4 mm), company name SARL FEL DRONE (Lexend 700, gras/bold — company clarification 2026-09-18) on the top arc, address — district + commune — on the outer bottom arc, RC + wilaya on the inner bottom arc (IBM Plex Sans), separator dots, approved mark centred (final scale 0.93, review 2026-09-18).", size=8.2)
    d.sub("Concept A — reserved NIF / NIS slot")
    text(c, ML, d.y, "Same geometry, capacity demonstrated · Dotted placeholders are not values", P5(), 8.4, GRAY)
    d.y -= 14
    d.ensure(sz + 44)
    draw_stamp_A(c, ML + sz / 2, d.y - sz / 2 - 2, 52, INK, reserved=True)
    d.y -= sz + 6
    d.body("A2 — when NIF & NIS are provided (DATA REQUIRED FROM COMPANY), the two dotted lines are cut as real values without any geometry change. This is the recommended final content structure for invoice use.", size=8.2)
    d.ensure(sz + 130)
    d.sub("Concept B — Modern Corporate")
    text(c, ML, d.y, "Intended use: quotes, reports, commercial correspondence · Recommended size: 50 mm", P5(), 8.4, GRAY)
    d.y -= 14
    d.ensure(sz + 44)
    draw_stamp_B(c, ML + sz / 2, d.y - sz / 2 - 2, 52, INK)
    d.y -= sz + 6
    d.body("B1 — manufacturing master. Single ring (0.5 mm), short name with wide tracking, RC on the bottom arc, larger mark, city line under the mark. More air, no secondary ring — contemporary but administratively credible.", size=8.2)
    d.ensure(sz + 130)
    d.sub("Concept C — Compact Official")
    text(c, ML, d.y, "Intended use: daily documents, small forms, frequent use · Recommended size: 30 mm", P5(), 8.4, GRAY)
    d.y -= 14
    d.ensure(sz + 44)
    draw_stamp_C(c, ML + sz / 2, d.y - sz / 2 - 2, 52, INK)
    d.y -= sz + 6
    d.body("C1 — manufacturing master. Single ring (0.5 mm), name + RC only, mark 6.8 mm. Every stroke stays ≥ 0.5 mm at 30 mm. Address excluded — below the legible minimum at this size.", size=8.2)
    d.ensure(70)
    c.saveState()
    c.setFillColor(BG)
    c.rect(ML, d.y - 34, UW, 34, stroke=0, fill=1)
    c.restoreState()
    para(c, ML + 10, d.y - 13, "No concept is legally approved or final. “Draft — human review required” until explicitly approved. The manufacturing master is monochrome black for all concepts (ink stamp); navy exists for presentation only.", P5(), 8.2, UW - 22, INK)
    d.y -= 34 + 14

    d.sub("Per-concept review sheet", 11)
    for name, rows in SPECS:
        d.ensure(185)
        text(c, ML, d.y, name, LX6(), 10, NAVY)
        d.y -= 13
        for lab, val in rows:
            d.ensure(24)
            text(c, ML + 64, d.y, lab, P5(), 8.2, GRAY, align="right")
            if re.search(r"[→≥]", val):
                toks = []
                for i2, part in enumerate(re.split(r"(→|≥)", val)):
                    if not part:
                        continue
                    if part in ("→", "≥"):
                        toks.append((part, ARW))
                    else:
                        toks.extend((w_, P4) for w_ in part.split(" ") if w_)
                yy = d.y
                for ln in wrap_tokens(toks, c, UW - 76, 8.2):
                    draw_tokens_line(c, ML + 72, yy, ln, 8.2, INK)
                    yy -= 11.6
                d.y = yy + 3
            else:
                lines = wrap(c, val, P4(), 8.2, UW - 76)
                yy = d.y
                for ln in lines:
                    text(c, ML + 72, yy, ln, P4(), 8.2, INK)
                    yy -= 11.6
                d.y = yy + 3
        d.y -= 10

    # ═══ §04 ═══
    d.section("04", "Physical-Size Simulation", "true scale · CSS mm")
    d.body("Rendered at true physical size (1 unit = 1 mm). Each concept at 30 / 40 / 45 / 50 mm. Note where text begins to compress: A's address arc is the first element to fall below a comfortable minimum at 30 mm.")
    for cname, draw, master in (("A — Classic", draw_stamp_A, 45), ("B — Modern", draw_stamp_B, 50), ("C — Compact", draw_stamp_C, 30)):
        d.ensure(195)
        d.sub(f"Concept {cname} (master {master} mm)", 9.5)
        sizes = [30, 40, 45, 50]
        total_w = sum(s * MM for s in sizes) + 3 * 6 * MM
        x = ML + (UW - total_w) / 2
        for s in sizes:
            wpt = s * MM
            draw(c, x + wpt / 2, d.y - wpt / 2 - 2, s, INK)
            text(c, x + wpt / 2, d.y - wpt - 10, f"{s} mm", P5(), 7.5, ACCENT if s == master else GRAY, align="center")
            x += wpt + 6 * MM
        d.y -= 50 * MM + 18

    # ═══ §05 ═══
    d.section("05", "Ink Simulation", "black master · navy presentation")
    items5 = [
        ("5.1 — Digital master.", "Solid black #000 on white. This is what the stamp maker receives. No gradients, no effects.", "vectorA"),
        ("5.2 — Inked impression (simulated).", "Subtle displacement + 93 % ink coverage simulating rubber-stamp spread on paper. Expect real impressions to vary ±10 % in density — the geometry was kept above 0.4 mm so legibility survives.", "pngAinked"),
        ("5.3 — Navy presentation (brand ink #0e1f30).", "For identity documents and brand collateral only. The physical stamp remains monochrome black (standard ink pad; navy pads fade unevenly).", "vectorAnavy"),
        ("5.4 — A2 inked (with NIF/NIS slot).", "Placeholder state, simulated impression.", "pngArsvd"),
        ("5.5 — B inked.", "Simulated impression, 50 mm.", "pngBinked"),
    ]
    for title, cap, kind in items5:
        d.ensure(48 * MM + 30)
        text(c, ML, d.y, title, P6(), 8.8, INK)
        d.y -= 12
        for ln in wrap(c, cap, P4(), 8.0, UW - 44 * MM - 16):
            text(c, ML, d.y, ln, P4(), 8.0, GRAY)
            d.y -= 11.2
        d.y -= 6
        img_y = d.y - 44 * MM
        if kind == "vectorA":
            draw_stamp_A(c, ML + 44 * MM + 22 * MM, d.y - 22 * MM, 44, INK)
        elif kind == "vectorAnavy":
            draw_stamp_A(c, ML + 44 * MM + 22 * MM, d.y - 22 * MM, 44, NAVY)
        elif kind == "pngAinked":
            c.drawImage(f"{INKD}/a-inked-600.png", ML + 44 * MM, img_y, width=44 * MM, height=44 * MM)
        elif kind == "pngArsvd":
            c.drawImage(f"{INKD}/a-rsvd-inked-600.png", ML + 44 * MM, img_y, width=44 * MM, height=44 * MM)
        elif kind == "pngBinked":
            c.drawImage(f"{INKD}/b-inked-600.png", ML + 44 * MM - 2 * MM, img_y - 2 * MM, width=48 * MM, height=48 * MM)
        d.y -= 46 * MM

    # ═══ §06 ═══
    d.section("06", "Document Simulation", "visual simulation only")
    d.body("Visual simulations only. The documents below are mock layouts for review. They are not legally approved documents, carry no real client data, and no value or legal force. Grey bars stand in for body copy.", size=8.2)

    def mock(x, y_top, wpt, hpt, kind):
        c.saveState()
        c.setStrokeColor(LINE2); c.setLineWidth(0.8)
        c.setFillColor(white)
        c.rect(x, y_top - hpt, wpt, hpt, stroke=1, fill=1)
        c.restoreState()
        draw_lockup(c, x + 8, y_top - 12, 8 * MM / 2.2, NAVY)
        c.saveState()
        c.setStrokeColor(LINE); c.setLineWidth(0.6)
        c.line(x + 8, y_top - 15, x + wpt - 8, y_top - 15)
        c.restoreState()
        meta = {
            "invoice": ("FACTURE N° —  DATE : —", "RC 36/00-0683602B26 · NIF : [à compléter] · NIS : [à compléter]", "FACTURE", 11),
            "devis": ("DEVIS N° —  DATE : —", "RC 36/00-0683602B26 · NIF : [à compléter] · NIS : [à compléter]", "DEVIS — PROPOSITION D'INTERVENTION", 8.2),
            "lettre": ("Cité 150 Logements B  Aïn El Assel, El Tarf", "Tél : +213 6 61 61 33 99", "LETTRE — CORRESPONDANCE OFFICIELLE", 8.2),
            "rapport": ("RAPPORT TECHNIQUE N° —  Mission : —", "RC 36/00-0683602B26", "RAPPORT TECHNIQUE — INSPECTION DRONE", 8.2),
        }[kind]
        ty = y_top - 26
        text(c, x + wpt - 8, ty, meta[0], P6(), 6.6, GRAY, align="right")
        l2 = wrap(c, meta[1], P4(), 5.8, wpt - 16)
        for i, ln in enumerate(l2):
            text(c, x + wpt - 8, ty - 8 - i * 7.5, ln, P4(), 5.8, GRAY, align="right")
        tyy = ty - 8 - len(l2) * 7.5 - 12
        text(c, x + 8, tyy, meta[2], LX7(), meta[3], NAVY, letter=0.7 if meta[3] > 9 else 0.4)
        tyy -= 15
        if kind == "invoice":
            text(c, x + 8, tyy, "Total HT : —    TVA : —    Total TTC : —", P5(), 7.2, INK)
            tyy -= 12
        c.saveState()
        c.setFillColor(BAR)
        yy = tyy - 8
        for fr in (0.92, 0.85, 0.9, 0.7, 0.88, 0.6):
            c.rect(x + 8, yy - 4.5, (wpt - 64) * fr, 3.2, stroke=0, fill=1)
            yy -= 8.5
        c.restoreState()
        stamp_w = 0.40 * wpt
        png = {"invoice": "a-inked-600.png", "devis": "b-inked-600.png", "lettre": "a-inked-600.png", "rapport": "c-inked-600.png"}[kind]
        c.drawImage(f"{INKD}/{png}", x + wpt - stamp_w - 8, y_top - hpt + 13, width=stamp_w, height=stamp_w)
        lab = "Le gérant" if kind == "lettre" else "Cachet & signature"
        text(c, x + wpt - stamp_w - 8 + stamp_w / 2, y_top - hpt + 5, lab, P5(), 6.2, GRAY, align="center")
        c.saveState()
        c.setFillColor(ACCENT)
        c.rect(x + wpt - 46, y_top - 10, 38, 9, stroke=0, fill=1)
        c.restoreState()
        text(c, x + wpt - 27, y_top - 8.6, "SIMULATION", P6(), 5.4, white, align="center", letter=0.4)

    pairs = [
        (("invoice", "Invoice — Concept A (45 mm)"), ("devis", "Quotation — Concept B (50 mm)")),
        (("lettre", "Official letter — Concept A (45 mm)"), ("rapport", "Technical report — Concept C (30 mm, compact use)")),
    ]
    mw = (UW - 10) / 2
    mh = 96 * MM
    for (k1, cap1), (k2, cap2) in pairs:
        d.ensure(mh + 26)
        mock(ML, d.y, mw, mh, k1)
        mock(ML + mw + 10, d.y, mw, mh, k2)
        d.y -= mh
        text(c, ML, d.y - 8, cap1, P5(), 7.8, GRAY)
        text(c, ML + mw + 10, d.y - 8, cap2, P5(), 7.8, GRAY)
        d.y -= 24

    # ═══ §07 ═══
    d.section("07", "Manufacturing Constraints", "for the cutter / stamp maker")
    d.kv_table(["Constraint", "Value"], MFR, [62, UW - 62], size=7.8)
    d.ensure(130)
    c.saveState()
    c.setFillColor(BG)
    c.rect(ML, d.y - 106, UW, 106, stroke=0, fill=1)
    c.restoreState()
    yy = d.y - 14
    yy = para(c, ML + 10, yy, "Not touched: production website, routes, content, API, security, Vercel, GHA, main branch, existing brand assets — this phase adds isolated review files only (scripts/identity-stamp.mjs, public/brand-review/stamp/…, one dev-only Vite middleware). Not part of production navigation.", P4(), 8.0, UW - 22, INK)
    proto = "Review protocol: inspect 01–07 → choose the direction (A / B / C / combination / redirect) → provide the DATA REQUIRED FROM COMPANY (NIF, NIS, optionally AI, Arabic name, decision on capital) → only then does the stamp become final. Nothing here is legally approved or final. PR is the review boundary — not merged."
    # tokenized: words in P5, arrows in the arrow font
    toks = []
    parts = proto.split("→")
    for i, part in enumerate(parts):
        toks.extend((w_, P5) for w_ in part.split(" ") if w_)
        if i < len(parts) - 1:
            toks.append(("→", ARW))
    plines = wrap_tokens(toks, c, UW - 22, 8.0)
    for pl in plines:
        draw_tokens_line(c, ML + 10, yy, pl, 8.0, GRAY)
        yy -= 11.4
    d.y = d.y - 106 - 14

    # ═══ §08 ═══
    d.section("08", "Invoice Template — Reference (FACTURE)", "cachet & signature zone")
    d.body("The Phase 2 review also delivers a French invoice template (FACTURE) at /brand-review/invoice/ — real A4 layout, D.E. 05-468 mentions, seller data with controlled « À COMPLÉTER » blanks (NIS, AI), TVA rate left selectable (no hardcoded rate), and a « Cachet et signature du vendeur » zone that references the Concept A stamp as visual reference. Export: public/brand-review/invoice/exports/FEL-DRONE-Facture-Template.pdf. The rendered reference below is the validated PDF page; the stamp it references is Concept A (corrected name: SARL FEL DRONE, Lexend 700 gras).", size=8.4)
    d.ensure(210 * MM)
    iw = 116 * MM
    ih = iw * 1754 / 1241
    x0 = ML + (UW - iw) / 2
    c.saveState()
    c.setStrokeColor(LINE2); c.setLineWidth(0.8)
    c.rect(x0 - 2, d.y - ih - 2, iw + 4, ih + 4, stroke=1, fill=0)
    c.restoreState()
    c.drawImage(f"{INKD}/invoice-ref-300.png", x0, d.y - ih, width=iw, height=ih)
    d.y -= ih + 12
    text(c, ML + UW / 2, d.y - 6, "A4 reference — rendered from the validated PDF (300 dpi)", P5(), 7.6, GRAY, align="center")
    d.y -= 20

    d.finish()
    return d.n - 1

if __name__ == "__main__":
    import fitz
    os.makedirs(os.path.dirname(FOUT), exist_ok=True)
    p1 = FOUT + ".pass1"
    build(p1, 1)
    n = fitz.open(p1).page_count
    build(FOUT, n)
    os.remove(p1)
    print("PAGES:", n)
    print("SIZE:", os.path.getsize(FOUT), "bytes")
