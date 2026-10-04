/* Dati di esempio: in produzione arriveranno dalle API */
window.DATA = {
  annunci: [
    { ini: 'LM', id: 'lm', nick: 'Luna & Matteo', cat: 'Coppia cerca coppia', tipo: 'Coppia', eta: '34 / 36', zona: 'Ravenna', ver: true, quando: 'Oggi',
      cover: { id: '1702725365144-6e8584ea54e4', autore: 'Francesco Liotti', user: 'francesco_liotti' }, coverVis: 'tutti',
      titolo: 'Prima un aperitivo, poi si vedrà', testo: 'Coppia curiosa, alle prime esperienze. Cerchiamo persone affini con cui conoscerci senza fretta.' },
    { ini: 'S', id: 'sole', nick: 'Sole_83', cat: 'Lei cerca coppia', tipo: 'Lei', eta: '41', zona: 'Cesena', ver: true, quando: 'Ieri',
      cover: { id: '1468056961052-15507578a50d', autore: 'Steve Allison', user: 'steveallison' }, coverVis: 'tutti',
      titolo: 'Serata al club il prossimo sabato', testo: 'Cerco una coppia simpatica per accompagnarmi alla serata a tema. Ci scriviamo prima per conoscerci.' },
    { ini: 'AR', id: 'ar', nick: 'Ale e Robi', cat: 'Coppia cerca lei', tipo: 'Coppia', eta: '29 / 31', zona: 'Rimini', ver: false, quando: '2 giorni fa',
      cover: { id: '1543007630-9710e4a00a20', autore: 'qui nguyen', user: 'quinguyen' }, coverVis: 'sfocata',
      titolo: 'Cerchiamo lei, complice e solare', testo: 'Coppia giovane e sportiva, ci piacerebbe conoscere una ragazza simpatica. Si parte da un caffè.' },
    { ini: 'D', id: 'davide', nick: 'Davide_RA', cat: 'Lui cerca coppia', tipo: 'Lui', eta: '38', zona: 'Lugo', ver: true, quando: '3 giorni fa',
      cover: { id: '1640902106532-47dd3a2e833e', autore: 'Andrea De Santis', user: 'santesson89' }, coverVis: 'verificati',
      titolo: 'Discreto, educato, senza fretta', testo: 'Disponibile per conoscere coppie. Rispetto dei tempi e dei limiti di tutti prima di ogni cosa.' },
    { ini: 'GE', id: 'ge', nick: 'Giulia & Enri', cat: 'Coppia cerca coppia', tipo: 'Coppia', eta: '45 / 47', zona: 'Forlì', ver: true, quando: '4 giorni fa',
      cover: { id: '1597075687490-8f673c6c17f6', autore: 'Ambitious Studio | Rick Barrett', user: 'weareambitious' }, coverVis: 'tutti',
      titolo: 'Amici prima di tutto', testo: 'Coppia navigata cerca nuove amicizie per cene e serate in compagnia. Solo profili verificati.' },
    { ini: 'M', id: 'marta', nick: 'Marta.bo', cat: 'Lei cerca lui', tipo: 'Lei', eta: '33', zona: 'Bologna', ver: false, quando: '1 settimana fa',
      titolo: 'Nuova in città', testo: 'Mi sono appena trasferita e vorrei conoscere persone aperte. Iniziamo con due chiacchiere in chat.' }
  ],

  profili: [
    { ini: 'LM', nick: 'Luna & Matteo', tipo: 'Coppia', eta: '34/36',
      foto: { id: '1570135497084-0debfc780ed8', autore: 'Ivan Moncada', user: 'ivamoncadar', pagina: 'LiKS9KCaWOA' }, citta: 'Ravenna', cerca: 'coppia', online: true, ver: true },
    { ini: 'S', nick: 'Sole_83', tipo: 'Lei', eta: '41',
      foto: { id: '1586211082529-b7c6b640abff', autore: 'Jorge Salvador', user: 'jsshotz', pagina: 'vVINLKZtGOI' }, citta: 'Cesena', cerca: 'coppia', online: true, ver: true },
    { ini: 'D', nick: 'Davide_RA', tipo: 'Lui', eta: '38', citta: 'Lugo', cerca: 'coppia, lei', online: false, ver: true },
    { ini: 'GE', nick: 'Giulia & Enri', tipo: 'Coppia', eta: '45/47',
      foto: { id: '1749855333713-0f4ad9d033e3', autore: 'Tim Mossholder', user: 'timmossholder', pagina: 'FBC2hoZaPuI' }, citta: 'Forlì', cerca: 'coppia', online: true, ver: true },
    { ini: 'K', nick: 'Kira.rn', tipo: 'Lei', eta: '29',
      foto: { id: '1606459310278-169d12230046', autore: 'Suvi Honkanen', user: 'suvihelena', pagina: 'oIi4sJZNSK8' }, citta: 'Rimini', cerca: 'lui', online: true, ver: false },
    { ini: 'AR', nick: 'Ale e Robi', tipo: 'Coppia', eta: '29/31', citta: 'Rimini', cerca: 'coppia, lei', online: false, ver: false },
    { ini: 'N', nick: 'Nikki', tipo: 'Trans', eta: '32',
      foto: { id: '1617290337590-4c7d02c99a45', autore: 'Bobbi Wu', user: 'bobbiwu', pagina: '55LBec8jP9M' }, citta: 'Bologna', cerca: 'lui, coppia', online: true, ver: true },
    { ini: 'PA', nick: 'Paola & Andrea', tipo: 'Coppia', eta: '50/52', citta: 'Faenza', cerca: 'coppia', online: false, ver: true }
  ],

  /* Foto Unsplash (licenza Unsplash, uso gratuito): silhouette senza volti riconoscibili */
  unsplash: (id, w = 400, h = 400) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&crop=entropy&auto=format&q=70`,

  /* Foto di lancio proposte nel form "Pubblica annuncio" (Unsplash, nessun volto) */
  coverEsempi: [
    { id: '1702725365144-6e8584ea54e4', autore: 'Francesco Liotti', user: 'francesco_liotti', alt: 'Due drink su un tavolino' },
    { id: '1468056961052-15507578a50d', autore: 'Steve Allison', user: 'steveallison', alt: 'Insegna luminosa di un bar' },
    { id: '1543007630-9710e4a00a20', autore: 'qui nguyen', user: 'quinguyen', alt: 'Lampadine sopra un bancone' },
    { id: '1640902106532-47dd3a2e833e', autore: 'Andrea De Santis', user: 'santesson89', alt: 'Bar in penombra' },
    { id: '1597075687490-8f673c6c17f6', autore: 'Ambitious Studio | Rick Barrett', user: 'weareambitious', alt: 'Martini su un tavolo di legno' },
    { id: '1615887584283-91f1be7fdc34', autore: 'Ambitious Studio | Rick Barrett', user: 'weareambitious', alt: 'Poltrona blu accanto a un tavolino' }
  ],

  conversazioni: [
    { ini: 'LM', nome: 'Luna & Matteo', sotto: 'Coppia, Ravenna, verificati', link: 'annuncio.html?id=lm', linkLabel: 'Vedi annuncio', ora: '21:14', nuovi: 2, msgs: [
      { mine: false, testo: 'Ciao! Abbiamo letto il vostro profilo, ci sembrate in sintonia con noi.', ora: '20:52' },
      { mine: true, testo: 'Ciao! Grazie, anche a noi il vostro annuncio è piaciuto molto.', ora: '20:58' },
      { mine: false, testo: 'Che ne dite di un aperitivo la prossima settimana, così ci conosciamo con calma?', ora: '21:10' },
      { mine: false, testo: 'Fateci sapere quando siete liberi.', ora: '21:14' } ] },
    { ini: 'S', nome: 'Sole_83', sotto: 'Lei, Cesena, verificata', link: 'annuncio.html?id=sole', linkLabel: 'Vedi annuncio', ora: 'Ieri', nuovi: 0, msgs: [
      { mine: false, testo: 'Allora confermato sabato al club?', ora: '18:30' },
      { mine: true, testo: 'Sì, ci vediamo all’ingresso alle 22.', ora: '18:41' } ] },
    { ini: 'VO', nome: 'Villa Ombrosa', sotto: 'Attività verificata, Brisighella', link: 'scheda.html', linkLabel: 'Vedi scheda', ora: 'Lun', nuovi: 0, msgs: [
      { mine: true, testo: 'Buongiorno, avete disponibilità per il weekend del 17?', ora: '10:05' },
      { mine: false, testo: 'Buongiorno! Sì, la suite con terrazza è libera. Lo sconto iscritti vale da domenica a giovedì.', ora: '11:20' } ] }
  ],

  luoghi: [
    { nome: 'Villa Ombrosa', cat: 'Struttura friendly', citta: 'Brisighella (RA)', descr: 'B&B adults only in collina, 6 camere, piscina riservata agli ospiti.', offerta: '-15% iscritti' },
    { nome: 'Velluto Boutique', link: 'shop.html', shop: true, cat: 'Boutique', citta: 'Rimini', descr: 'Lingerie, accessori e giochi, con consulenza in negozio e spedizione discreta.', offerta: '-10% iscritti' },
    { nome: 'Club Ventaglio', link: 'locale.html', cat: 'Club', citta: 'Bologna', descr: 'Locale privé con serate a tema il venerdì e il sabato.', offerta: 'Ingresso coppie omaggio' },
    { nome: 'Loft sul Canale', cat: 'Spazio privato', citta: 'Ravenna', descr: 'Appartamento di un host verificato, check-in registrato.', offerta: '' },
    { nome: 'Agriturismo Le Fosse', cat: 'Struttura friendly', citta: 'Bertinoro (FC)', descr: 'Suite indipendenti e cena su prenotazione.', offerta: 'Late check-out' },
    { nome: 'Desiderio Store', link: 'shop.html', shop: true, cat: 'Boutique', citta: 'Online', descr: 'Shop online con codice sconto dedicato alla community.', offerta: '-20% primo ordine' }
  ],

  /* Shop online delle attività (prezzi di esempio; foto Unsplash, licenza gratuita) */
  shop: {
    nome: 'Velluto Boutique',
    citta: 'Rimini',
    prodotti: [
      { id: 'p1', img: '1573209946145-848669b5ef39', cat: 'Protezione', nome: 'Preservativi ultrasottili', det: 'Confezione da 12, certificati CE', prezzo: 9.9 },
      { id: 'p2', img: '1574007444177-5f6d21d6af70', cat: 'Protezione', nome: 'Preservativi senza lattice', det: 'Confezione da 10, per chi ha sensibilità', prezzo: 11.5 },
      { id: 'p3', img: '1638416606166-793c9d691c04', cat: 'Benessere', nome: 'Lubrificante a base acqua', det: '100 ml, compatibile con preservativi e giochi', prezzo: 12.9 },
      { id: 'p4', img: '1606259457945-67dc66271ee6', cat: 'Benessere', nome: 'Olio da massaggio', det: '150 ml, mandorla e vaniglia', prezzo: 16.0 },
      { id: 'p5', img: '1755642754869-2c69a62dc306', cat: 'Giochi', nome: 'Massaggiatore a rosa', det: 'Silicone morbido, ricaricabile, silenzioso', prezzo: 39.0 },
      { id: 'p6', img: '1707587683483-65eb5595b5af', cat: 'Giochi', nome: 'Vibratore in silicone', det: 'Ricaricabile USB, 10 modalità, impermeabile', prezzo: 49.0 },
      { id: 'p7', img: '1648782360078-52084f329945', cat: 'Giochi', nome: 'Anello vibrante per coppia', det: 'Silicone medicale, ricaricabile', prezzo: 29.0 },
      { id: 'p8', img: '1612744192242-35cd7a7d35e6', cat: 'Giochi', nome: 'Set benda e piuma', det: 'Raso nero, lavabile', prezzo: 14.5 },
      { id: 'p9', img: '1654512041772-446bd165a3b3', cat: 'Kit coppia', nome: 'Kit prima serata', det: 'Preservativi, lubrificante, benda e candela', prezzo: 39.0 },
      { id: 'p10', img: '1616783335090-ec6e7ac63975', cat: 'Kit coppia', nome: 'Kit weekend', det: 'Tutto il kit prima serata più olio e anello vibrante', prezzo: 79.0 },
      { id: 'p11', img: '1617055407123-3d7130c1f940', cat: 'Lingerie', nome: 'Completo in pizzo', det: 'Taglie dalla XS alla XL', prezzo: 45.0 },
      { id: 'p12', img: '1518893063132-36e46dbe2428', cat: 'Lingerie', nome: 'Kimono in raso', det: 'Taglia unica, bordeaux', prezzo: 38.0 }
    ]
  },

  /* Eventi pubblicati dai locali: prevendita a prezzo ridotto rispetto all'ingresso (prezzi di esempio) */
  eventi: [
    { id: 'ev1', locale: 'Club Ventaglio', ini: 'CV', citta: 'Bologna', link: 'locale.html', cert: true, quando: 'Ven 9 ott, 23:00', tipo: 'Serata a tema',
      titolo: 'Notte in rosso', testo: 'Dress code rosso e nero, DJ set fino a tardi e aree riservate aperte tutta la notte.', prevendita: 30, ingresso: 40, cover: '1468056961052-15507578a50d' },
    { id: 'ev2', locale: 'Club Ventaglio', ini: 'CV', citta: 'Bologna', link: 'locale.html', cert: true, quando: 'Sab 10 ott, 22:30', tipo: 'Prima volta',
      titolo: 'Prima volta al club', testo: 'Serata guidata: lo staff ti accompagna, spiega le regole del locale e ti presenta gli spazi.', prevendita: 25, ingresso: 35, cover: '1615887584283-91f1be7fdc34' },
    { id: 'ev3', locale: 'Villa Ombrosa', ini: 'VO', citta: 'Brisighella (RA)', link: 'scheda.html', cert: true, quando: 'Sab 17 ott, 19:00', tipo: 'Aperitivo',
      titolo: 'Aperitivo in piscina', testo: 'Aperitivo al tramonto riservato agli ospiti e agli iscritti, con musica dal vivo a bordo vasca.', prevendita: 20, ingresso: 28, cover: '1702725365144-6e8584ea54e4' },
    { id: 'ev4', locale: 'Bar Lanterna', ini: 'BL', citta: 'Rimini', link: 'luoghi.html', cert: false, quando: 'Ven 23 ott, 22:00', tipo: 'Festa in maschera',
      titolo: 'Masquerade', testo: 'Maschera obbligatoria, la trovi all’ingresso. Primo drink incluso con la prevendita.', prevendita: 18, ingresso: 25, cover: '1543007630-9710e4a00a20' }
  ],

  /* Profilo di un locale: serate, coupon e servizi in vendita (prezzi di esempio) */
  locale: {
    nome: 'Club Ventaglio',
    citta: 'Bologna',
    foto: ['1468056961052-15507578a50d', '1597075687490-8f673c6c17f6', '1615887584283-91f1be7fdc34'],
    orari: 'Ven e sab, 22:00 – 4:00',
    regole: ['Solo maggiorenni con documento', 'Ingresso coppie e singole; singoli su lista', 'Dress code elegante, niente sneakers', 'Il consenso viene prima di tutto: chi non lo rispetta esce'],
    serate: [
      { id: 's1', giorno: 'Ven 9', titolo: 'Notte in rosso', det: 'Dress code rosso e nero, DJ set dalle 23' },
      { id: 's2', giorno: 'Sab 10', titolo: 'Prima volta al club', det: 'Serata guidata per chi viene per la prima volta' },
      { id: 's3', giorno: 'Sab 17', titolo: 'Masquerade', det: 'Maschera obbligatoria, la trovi all’ingresso' }
    ],
    offerte: [
      { id: 'c1', tipo: 'Coupon', nome: 'Ingresso coppia + 2 drink', det: 'Valido in qualsiasi serata del mese', prezzo: 40, listino: 50 },
      { id: 'c2', tipo: 'Coupon', nome: 'Ingresso singola', det: 'Venerdì e sabato, entro mezzanotte', prezzo: 0, listino: 15, nota: 'Omaggio per le iscritte verificate' },
      { id: 'c3', tipo: 'Servizio', nome: 'Tavolo riservato', det: 'Fino a 4 persone, con bottiglia', prezzo: 120 },
      { id: 'c4', tipo: 'Servizio', nome: 'Privé per la serata', det: 'Area riservata per 2 coppie, ingresso incluso', prezzo: 200 },
      { id: 'c5', tipo: 'Servizio', nome: 'Pacchetto prima volta', det: 'Ingresso, drink e giro del locale con lo staff', prezzo: 55 }
    ]
  },

  /* Extra proposti dopo la richiesta di prenotazione (upselling) */
  extraSoggiorno: {
    struttura: 'Villa Ombrosa',
    date: 'Ven 17 – Dom 19',
    ospiti: '2 adulti',
    camera: 'Suite con terrazza',
    extra: [
      { id: 'e1', nome: 'Kit protezione in camera', det: 'Preservativi e lubrificante, già in camera all’arrivo', prezzo: 15, da: 'Velluto Boutique', tipo: 'shop' },
      { id: 'e2', nome: 'Kit prima serata', det: 'Preservativi, lubrificante, benda e candela da massaggio', prezzo: 39, da: 'Velluto Boutique', tipo: 'shop' },
      { id: 'e3', nome: 'Bollicine in fresco', det: 'Bottiglia di spumante e due calici in camera', prezzo: 28, da: 'Villa Ombrosa', tipo: 'struttura' },
      { id: 'e4', nome: 'Petali e candele', det: 'Allestimento della camera prima dell’arrivo', prezzo: 25, da: 'Villa Ombrosa', tipo: 'struttura' },
      { id: 'e5', nome: 'Late check-out', det: 'Domenica fino alle 16', prezzo: 30, da: 'Villa Ombrosa', tipo: 'struttura' }
    ]
  },

  /* Storie della community (testi originali di esempio, senza contenuti espliciti) */
  storie: [
    { id: 'aperitivo', img: '1702725365144-6e8584ea54e4', cat: 'Scambio di coppia', titolo: 'Prima un aperitivo', autore: 'Duesumare', ini: 'DM', data: '3 ott', min: 6, like: 48, commenti: 12,
      tag: ['aperitivo', 'sguardi', 'coppie'],
      estratto: 'Ci eravamo detti: solo un aperitivo, e se non scatta niente torniamo a casa e ci ridiamo sopra. Poi lei ha riso a una battuta di mio marito, e io ho capito che non saremmo tornati presto.',
      testo: [
        'Ci eravamo detti: solo un aperitivo, e se non scatta niente torniamo a casa e ci ridiamo sopra. Avevamo scelto un bar sul porto, abbastanza affollato da sentirci al sicuro, abbastanza rumoroso da doverci avvicinare per parlare.',
        'Loro erano già seduti. Lei aveva un vestito verde e una risata che si sentiva da tre tavoli di distanza. Lui era più timido, girava il bicchiere tra le dita come se cercasse le parole lì dentro. Per la prima mezz’ora abbiamo parlato di lavoro, di vacanze, di quanto fosse strano essere lì.',
        'Poi lei ha riso a una battuta di mio marito, gli ha appoggiato la mano sul braccio per un secondo di troppo, e lui ha guardato me. Non per chiedermi il permesso: per controllare che stessi bene. Io stavo benissimo.',
        'Il secondo giro l’abbiamo ordinato senza chiederci niente. Il terzo l’abbiamo bevuto a casa loro, sul terrazzo, con le scarpe in mano e la città accesa sotto di noi. Il resto lo teniamo per noi quattro.'
      ] },
    { id: 'chiave-12', img: '1606259458027-54d2a728b6ab', cat: 'In vacanza', titolo: 'La chiave della 12', autore: 'Viaggiatore_72', ini: 'V7', data: '2 ott', min: 5, like: 31, commenti: 7,
      tag: ['hotel', 'viaggio', 'sconosciuti'],
      estratto: 'La receptionist si era sbagliata: mi aveva dato la chiave della 12 invece della 21. Me ne sono accorto solo quando la porta si è aperta su una stanza con la luce accesa e qualcuno sul balcone.',
      testo: [
        'La receptionist si era sbagliata: mi aveva dato la chiave della 12 invece della 21. Me ne sono accorto solo quando la porta si è aperta su una stanza con la luce accesa e una donna sul balcone, un libro in mano e i piedi sulla ringhiera.',
        'Ho balbettato delle scuse. Lei ha chiuso il libro, mi ha guardato da capo a piedi e ha detto che tanto il libro era noioso. Poi mi ha offerto un bicchiere di vino, perché la bottiglia era già aperta e da sola non l’avrebbe finita.',
        'Abbiamo parlato fino a quando il mare è diventato nero. Di lei so il nome di battesimo, il colore del costume e il modo in cui tiene il bicchiere con due dita. Non so il cognome, né da dove venisse.',
        'Quando sono sceso a cambiare la chiave, la mattina dopo, la receptionist mi ha chiesto se avessi dormito bene. Le ho detto che era stato un errore fortunato.'
      ] },
    { id: 'masquerade', img: '1468056961052-15507578a50d', cat: 'Club e serate', titolo: 'Masquerade', autore: 'Notturna', ini: 'NO', data: '1 ott', min: 7, like: 63, commenti: 18,
      tag: ['maschera', 'club', 'prima volta'],
      estratto: 'Con la maschera addosso non ero più io, o forse lo ero di più. Lo staff ci aveva spiegato le regole all’ingresso: guardare si può, toccare solo se l’altro dice sì.',
      testo: [
        'Con la maschera addosso non ero più io, o forse lo ero di più. Era la nostra prima volta in un club e avevamo scelto la serata in maschera proprio per questo: per nasconderci un po’, almeno all’inizio.',
        'Lo staff ci aveva spiegato le regole all’ingresso, con la calma di chi le ripete ogni sera: guardare si può, toccare solo se l’altro dice sì, e un no non ha bisogno di spiegazioni. Mi è sembrata la cosa più sensuale che avessi sentito da mesi.',
        'Abbiamo ballato a lungo, solo noi due. Poi una coppia ci ha sorriso dal bancone, e quel sorriso ci ha accompagnato per tutta la sera senza bisogno di altro. A volte basta sapere di essere guardati.',
        'In macchina, tornando, mi sono tolta la maschera e mi sono accorta che avevo ancora il segno sulle guance. Lui l’ha sfiorato con un dito e ha detto: la prossima volta togliamocela prima.'
      ] },
    { id: 'lettere', img: '1594734415578-00fc9540929b', cat: 'Lei & lei', titolo: 'Lettere a una sconosciuta', autore: 'Lei_che_scrive', ini: 'LS', data: '30 set', min: 8, like: 57, commenti: 21,
      tag: ['lettere', 'attesa', 'parole'],
      estratto: 'Ci siamo scritte per tre mesi senza mai vederci. Ogni lettera era più lunga della precedente, e ogni volta mi accorgevo che rileggevo le sue frasi con la voce che immaginavo per lei.',
      testo: [
        'Ci siamo scritte per tre mesi senza mai vederci. Era cominciato con un commento sotto una storia, poi un messaggio, poi lettere vere, lunghe, scritte la sera con il telefono appoggiato sul cuscino.',
        'Ogni lettera era più lunga della precedente. Lei descriveva le cose più piccole, il caffè che si raffredda, le mani fredde d’inverno, il modo in cui si sistema i capelli dietro l’orecchio quando è nervosa. Io rileggevo le sue frasi con la voce che immaginavo per lei.',
        'Quando abbiamo deciso di incontrarci, abbiamo scelto una libreria, perché ci sembrava il posto giusto per due che si erano conosciute con le parole. Era più bassa di come la pensavo, e più bella.',
        'Non ci siamo dette quasi niente. Mi ha preso la mano tra gli scaffali della poesia, e per la prima volta in tre mesi non avevo bisogno di scrivere quello che sentivo.'
      ] },
    { id: 'terzo-bicchiere', img: '1597075687490-8f673c6c17f6', cat: 'In tre', titolo: 'Il terzo bicchiere', autore: 'Penna_Rossa', ini: 'PR', data: '29 set', min: 6, like: 44, commenti: 9,
      tag: ['amicizia', 'cena', 'terrazzo'],
      estratto: 'Apparecchiare per tre era diventata un’abitudine del giovedì. Quella sera però, mentre sistemavo i bicchieri, mi sono accorta che nessuno dei tre aveva voglia di andare via.',
      testo: [
        'Apparecchiare per tre era diventata un’abitudine del giovedì. Marco portava il vino, io cucinavo, e Sara arrivava sempre in ritardo con un dolce comprato all’ultimo minuto e un’ottima scusa.',
        'Quella sera faceva caldo e abbiamo mangiato sul terrazzo. Si è parlato di tutto, anche di cose di cui non avevamo mai parlato: fantasie, desideri, quello che ognuno avrebbe voluto provare almeno una volta.',
        'Il terzo bicchiere l’ho riempito io, e mentre lo facevo mi sono accorta che nessuno dei tre aveva voglia di andare via. Ci siamo guardati, e c’era una domanda nell’aria che nessuno voleva fare per primo.',
        'L’ha fatta Sara, alla fine, con la sua solita leggerezza. E la risposta, per tutti e tre, è stata sì.'
      ] },
    { id: 'non-ti-ho-detto', img: '1634393653736-98a63fb73742', cat: 'Confessioni', titolo: 'Quello che non ti ho detto', autore: 'Ombra_e_Mare', ini: 'OM', data: '28 set', min: 4, like: 39, commenti: 15,
      tag: ['coppia', 'fantasia', 'fiducia'],
      estratto: 'Dopo otto anni insieme pensavo di conoscerti a memoria. Poi una sera, a letto, mi hai chiesto qual era la fantasia che non ti avevo mai raccontato. E io te l’ho detta.',
      testo: [
        'Dopo otto anni insieme pensavo di conoscerti a memoria: come bevi il caffè, da che parte dormi, cosa dici quando sei stanco. Poi una sera, a letto, al buio, mi hai chiesto qual era la fantasia che non ti avevo mai raccontato.',
        'Ho riso, ho cambiato discorso, ho detto che non ce n’erano. Tu hai aspettato. Hai questa pazienza che mi fa impazzire, come se avessi tutto il tempo del mondo per sentire una cosa sola.',
        'Così te l’ho detta. Lentamente, con la faccia nel cuscino, sicura che avresti riso o, peggio, che ti saresti offeso. Invece mi hai stretto e hai detto: anche io.',
        'Da quella sera abbiamo iniziato a parlarne, poi a cercare, poi a scrivere qui. Questa è la prima storia. Non sarà l’ultima.'
      ] }
  ],
  storieCategorie: [
    { gruppo: 'Coppia e dintorni', voci: ['Lui & Lei', 'Scambio di coppia', 'In tre', 'Prime volte'] },
    { gruppo: 'Arcobaleno', voci: ['Lei & lei', 'Lui & lui', 'Trans'] },
    { gruppo: 'Atmosfere', voci: ['Club e serate', 'In vacanza', 'Confessioni', 'Giochi di ruolo'] }
  ],
  storieAutori: [
    { nick: 'Penna_Rossa', ini: 'PR', tipo: 'Lei', storie: 14 },
    { nick: 'Notturna', ini: 'NO', tipo: 'Lei', storie: 9 },
    { nick: 'Duesumare', ini: 'DM', tipo: 'Coppia', storie: 7 },
    { nick: 'Viaggiatore_72', ini: 'V7', tipo: 'Lui', storie: 5 },
    { nick: 'Lei_che_scrive', ini: 'LS', tipo: 'Lei', storie: 4 }
  ],
  storieTag: ['mare', 'hotel', 'aperitivo', 'maschera', 'lettere', 'treno', 'sauna', 'terrazzo', 'prima volta', 'club', 'sguardi', 'viaggio', 'fiducia', 'attesa'],

  /* Vetrina: creator verificati e contenuti (anteprime non esplicite, prezzi di esempio) */
  vetrina: {
    creator: [
      { id: 'kira', nick: 'Kira.rn', tipo: 'Lei', citta: 'Rimini', foto: '1606459310278-169d12230046', abbonamento: 9.9, nFoto: 48, nVideo: 12, bio: 'Lingerie, luci basse e tanta ironia.' },
      { id: 'nikki', nick: 'Nikki', tipo: 'Trans', citta: 'Bologna', foto: '1617290337590-4c7d02c99a45', abbonamento: 12.9, nFoto: 63, nVideo: 20, bio: 'Mi piace farmi guardare, con eleganza.' },
      { id: 'lm', nick: 'Luna & Matteo', tipo: 'Coppia', citta: 'Ravenna', foto: '1570135497084-0debfc780ed8', abbonamento: 14.9, nFoto: 31, nVideo: 9, bio: 'La nostra coppia, senza filtri ma con stile.' },
      { id: 'sole', nick: 'Sole_83', tipo: 'Lei', citta: 'Cesena', foto: '1586211082529-b7c6b640abff', abbonamento: 7.9, nFoto: 22, nVideo: 4, bio: 'Quarant’anni e nessuna voglia di nascondermi.' }
    ],
    post: [
      { id: 'v1', creator: 'kira', tipo: 'foto', accesso: 'free', titolo: 'Domenica mattina', img: '1606459310278-169d12230046', like: 210 },
      { id: 'v2', creator: 'nikki', tipo: 'video', accesso: 'ppv', prezzo: 6, durata: '4:12', titolo: 'Specchio', img: '1617290337590-4c7d02c99a45', like: 154 },
      { id: 'v3', creator: 'lm', tipo: 'foto', accesso: 'sub', titolo: 'Hotel, stanza 12', img: '1606259458027-54d2a728b6ab', like: 98 },
      { id: 'v4', creator: 'sole', tipo: 'foto', accesso: 'free', titolo: 'Controluce', img: '1586211082529-b7c6b640abff', like: 132 },
      { id: 'v5', creator: 'kira', tipo: 'video', accesso: 'sub', durata: '7:40', titolo: 'Backstage', img: '1617055407123-3d7130c1f940', like: 187 },
      { id: 'v6', creator: 'nikki', tipo: 'foto', accesso: 'ppv', prezzo: 3, titolo: 'Raso rosso', img: '1518893063132-36e46dbe2428', like: 121 },
      { id: 'v7', creator: 'lm', tipo: 'video', accesso: 'ppv', prezzo: 9, durata: '12:05', titolo: 'Serata in maschera', img: '1468056961052-15507578a50d', like: 76 },
      { id: 'v8', creator: 'sole', tipo: 'foto', accesso: 'sub', titolo: 'Lenzuola bianche', img: '1634393653736-98a63fb73742', like: 64 }
    ]
  },

  /* Webcam: stanze live dei creator verificati (anteprime non esplicite, numeri di esempio) */
  webcam: {
    crediti: 120,
    stanze: [
      { id: 'kira', nick: 'Kira.rn', tipo: 'Lei', citta: 'Rimini', img: '1606459310278-169d12230046', live: true, spettatori: 86, titolo: 'Chiacchiere e lingerie, scegliete voi il colore', privato: 6, goal: { label: 'Cambio look', target: 500, ora: 320 }, tag: ['lingerie', 'chiacchiere'] },
      { id: 'nikki', nick: 'Nikki', tipo: 'Trans', citta: 'Bologna', img: '1617290337590-4c7d02c99a45', live: true, spettatori: 142, titolo: 'Serata allo specchio', privato: 8, goal: { label: 'Ballo a tema', target: 800, ora: 610 }, tag: ['ballo', 'specchio'] },
      { id: 'lm', nick: 'Luna & Matteo', tipo: 'Coppia', citta: 'Ravenna', img: '1570135497084-0debfc780ed8', live: true, spettatori: 64, titolo: 'Coppia in diretta, domande a ruota libera', privato: 10, goal: { label: 'Gioco di coppia', target: 1000, ora: 240 }, tag: ['coppia', 'domande'] },
      { id: 'sole', nick: 'Sole_83', tipo: 'Lei', citta: 'Cesena', img: '1586211082529-b7c6b640abff', live: true, spettatori: 37, titolo: 'Controluce, solo per chi resta', privato: 5, goal: { label: 'Musica a richiesta', target: 300, ora: 280 }, tag: ['controluce'] },
      { id: 'ge', nick: 'Giulia & Enri', tipo: 'Coppia', citta: 'Forlì', img: '1749855333713-0f4ad9d033e3', live: false, prossima: 'Stasera, 22:30', spettatori: 0, titolo: 'Aperitivo in cam', privato: 9, goal: { label: '', target: 0, ora: 0 }, tag: ['coppia'] },
      { id: 'dav', nick: 'Davide_RA', tipo: 'Lui', citta: 'Lugo', img: '1640902106532-47dd3a2e833e', live: false, prossima: 'Domani, 21:00', spettatori: 0, titolo: 'Bar sotto casa', privato: 5, goal: { label: '', target: 0, ora: 0 }, tag: ['lui'] }
    ],
    chat: ['Ciao a tutti!', 'Che bella luce stasera', 'Sono di Ravenna anche io', 'Bel tema!', 'Arrivo dal club, serata tranquilla', 'Che musica è?', 'Mandate cuori al goal', 'Ciao dal mare']
  },

  regioni: ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
            'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto']
};
