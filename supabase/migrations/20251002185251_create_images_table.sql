/*
  # Opprett bilder-tabell

  1. Nye tabeller
    - `images`
      - `id` (uuid, primærnøkkel) - Unik identifikator for hvert bilde
      - `title` (text, valgfri) - Tittel eller beskrivelse av bildet
      - `url` (text, påkrevd) - URL til bildet (kan være Supabase Storage URL eller ekstern URL)
      - `alt_text` (text, valgfri) - Alt-tekst for tilgjengelighet
      - `category` (text, valgfri) - Kategori for organisering (f.eks. 'hero', 'feature', 'testimonial')
      - `is_active` (boolean, standard: true) - Om bildet er aktivt og skal vises på nettsiden
      - `display_order` (integer, valgfri) - Rekkefølge for visning av bilder
      - `created_at` (timestamptz) - Tidspunkt for opprettelse
      - `updated_at` (timestamptz) - Tidspunkt for siste oppdatering
      - `created_by` (uuid, valgfri) - Referanse til bruker som opprettet bildet (fremtidig bruk)

  2. Sikkerhet
    - Aktiver RLS på `images`-tabellen for å beskytte data
    - Legg til policy for offentlig lesing av aktive bilder (siden dette er for en nettside)
    - Legg til policy for autentiserte brukere til å administrere bilder (innsetting, oppdatering, sletting)

  3. Notater
    - Tabellen støtter både Supabase Storage URLs og eksterne bilde-URLer
    - `is_active` flagget gjør det enkelt å skjule bilder uten å slette dem
    - `display_order` kan brukes for å kontrollere rekkefølgen bildene vises i
    - `category` gjør det enkelt å hente bilder for spesifikke seksjoner av nettsiden
*/

-- Opprett images-tabellen
CREATE TABLE IF NOT EXISTS images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text,
  url text NOT NULL,
  alt_text text,
  category text,
  is_active boolean DEFAULT true,
  display_order integer,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid
);

-- Aktiver RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;

-- Policy: Alle kan lese aktive bilder (offentlig tilgang for nettside)
CREATE POLICY "Anyone can view active images"
  ON images
  FOR SELECT
  USING (is_active = true);

-- Policy: Autentiserte brukere kan sette inn bilder
CREATE POLICY "Authenticated users can insert images"
  ON images
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Autentiserte brukere kan oppdatere bilder
CREATE POLICY "Authenticated users can update images"
  ON images
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Autentiserte brukere kan slette bilder
CREATE POLICY "Authenticated users can delete images"
  ON images
  FOR DELETE
  TO authenticated
  USING (true);

-- Opprett indeks for raskere spørringer
CREATE INDEX IF NOT EXISTS idx_images_category ON images(category);
CREATE INDEX IF NOT EXISTS idx_images_is_active ON images(is_active);
CREATE INDEX IF NOT EXISTS idx_images_display_order ON images(display_order);

-- Opprett trigger for automatisk oppdatering av updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_images_updated_at
  BEFORE UPDATE ON images
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
