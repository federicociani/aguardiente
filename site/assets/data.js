/* Dati di esempio: in produzione arriveranno dalle API */
window.DATA = {
  annunci: [
    { ini: 'LM', nick: 'Luna & Matteo', cat: 'Coppia cerca coppia', tipo: 'Coppia', eta: '34 / 36', zona: 'Ravenna', ver: true, quando: 'Oggi',
      titolo: 'Prima un aperitivo, poi si vedrà', testo: 'Coppia curiosa, alle prime esperienze. Cerchiamo persone affini con cui conoscerci senza fretta.' },
    { ini: 'S', nick: 'Sole_83', cat: 'Lei cerca coppia', tipo: 'Lei', eta: '41', zona: 'Cesena', ver: true, quando: 'Ieri',
      titolo: 'Serata al club il prossimo sabato', testo: 'Cerco una coppia simpatica per accompagnarmi alla serata a tema. Ci scriviamo prima per conoscerci.' },
    { ini: 'AR', nick: 'Ale e Robi', cat: 'Coppia cerca lei', tipo: 'Coppia', eta: '29 / 31', zona: 'Rimini', ver: false, quando: '2 giorni fa',
      titolo: 'Cerchiamo lei, complice e solare', testo: 'Coppia giovane e sportiva, ci piacerebbe conoscere una ragazza simpatica. Si parte da un caffè.' },
    { ini: 'D', nick: 'Davide_RA', cat: 'Lui cerca coppia', tipo: 'Lui', eta: '38', zona: 'Lugo', ver: true, quando: '3 giorni fa',
      titolo: 'Discreto, educato, senza fretta', testo: 'Disponibile per conoscere coppie. Rispetto dei tempi e dei limiti di tutti prima di ogni cosa.' },
    { ini: 'GE', nick: 'Giulia & Enri', cat: 'Coppia cerca coppia', tipo: 'Coppia', eta: '45 / 47', zona: 'Forlì', ver: true, quando: '4 giorni fa',
      titolo: 'Amici prima di tutto', testo: 'Coppia navigata cerca nuove amicizie per cene e serate in compagnia. Solo profili verificati.' },
    { ini: 'M', nick: 'Marta.bo', cat: 'Lei cerca lui', tipo: 'Lei', eta: '33', zona: 'Bologna', ver: false, quando: '1 settimana fa',
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

  conversazioni: [
    { ini: 'LM', nome: 'Luna & Matteo', sotto: 'Coppia, Ravenna, verificati', link: 'annunci.html', linkLabel: 'Vedi annuncio', ora: '21:14', nuovi: 2, msgs: [
      { mine: false, testo: 'Ciao! Abbiamo letto il vostro profilo, ci sembrate in sintonia con noi.', ora: '20:52' },
      { mine: true, testo: 'Ciao! Grazie, anche a noi il vostro annuncio è piaciuto molto.', ora: '20:58' },
      { mine: false, testo: 'Che ne dite di un aperitivo la prossima settimana, così ci conosciamo con calma?', ora: '21:10' },
      { mine: false, testo: 'Fateci sapere quando siete liberi.', ora: '21:14' } ] },
    { ini: 'S', nome: 'Sole_83', sotto: 'Lei, Cesena, verificata', link: 'annunci.html', linkLabel: 'Vedi annuncio', ora: 'Ieri', nuovi: 0, msgs: [
      { mine: false, testo: 'Allora confermato sabato al club?', ora: '18:30' },
      { mine: true, testo: 'Sì, ci vediamo all’ingresso alle 22.', ora: '18:41' } ] },
    { ini: 'VO', nome: 'Villa Ombrosa', sotto: 'Attività verificata, Brisighella', link: 'scheda.html', linkLabel: 'Vedi scheda', ora: 'Lun', nuovi: 0, msgs: [
      { mine: true, testo: 'Buongiorno, avete disponibilità per il weekend del 17?', ora: '10:05' },
      { mine: false, testo: 'Buongiorno! Sì, la suite con terrazza è libera. Lo sconto iscritti vale da domenica a giovedì.', ora: '11:20' } ] }
  ],

  luoghi: [
    { nome: 'Villa Ombrosa', cat: 'Struttura friendly', citta: 'Brisighella (RA)', descr: 'B&B adults only in collina, 6 camere, piscina riservata agli ospiti.', offerta: '-15% iscritti' },
    { nome: 'Velluto Boutique', cat: 'Boutique', citta: 'Rimini', descr: 'Lingerie, accessori e giochi, con consulenza in negozio e spedizione discreta.', offerta: '-10% iscritti' },
    { nome: 'Club Ventaglio', cat: 'Club', citta: 'Bologna', descr: 'Locale privé con serate a tema il venerdì e il sabato.', offerta: 'Ingresso coppie omaggio' },
    { nome: 'Loft sul Canale', cat: 'Spazio privato', citta: 'Ravenna', descr: 'Appartamento di un host verificato, check-in registrato.', offerta: '' },
    { nome: 'Agriturismo Le Fosse', cat: 'Struttura friendly', citta: 'Bertinoro (FC)', descr: 'Suite indipendenti e cena su prenotazione.', offerta: 'Late check-out' },
    { nome: 'Desiderio Store', cat: 'Boutique', citta: 'Online', descr: 'Shop online con codice sconto dedicato alla community.', offerta: '-20% primo ordine' }
  ],

  regioni: ['Abruzzo', 'Basilicata', 'Calabria', 'Campania', 'Emilia-Romagna', 'Friuli-Venezia Giulia', 'Lazio', 'Liguria', 'Lombardia', 'Marche',
            'Molise', 'Piemonte', 'Puglia', 'Sardegna', 'Sicilia', 'Toscana', 'Trentino-Alto Adige', 'Umbria', "Valle d'Aosta", 'Veneto']
};
