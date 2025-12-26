
import requests
from bs4 import BeautifulSoup
from datetime import datetime

BCV_URL = "https://www.bcv.org.ve/"

def scrape_bcv_rates():
    """
    Realiza el scraping de la página del BCV para obtener las tasas USD y EUR.
    Returns: dict {"USD": float, "EUR": float, "date": str}
    """
    try:
        # Usar un user-agent para simular un navegador real
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36'
        }
        
        # Realizar la solicitud HTTP
        print(f"Iniciando scraping a {BCV_URL}...")
        response = requests.get(BCV_URL, headers=headers, timeout=15, verify=False)
        response.raise_for_status()

        # Parsear el contenido HTML
        soup = BeautifulSoup(response.content, 'html.parser')
        
        usd_rate = None
        eur_rate = None

        # 1. Búsqueda por la tarjeta principal (dólar USD)
        usd_div = soup.find('div', id='dolar')
        if not usd_div:
             usd_div = soup.find('div', id='rate')

        if usd_div:
            rate_element = usd_div.find('strong')
            if rate_element:
                raw_rate = rate_element.text.strip().replace('.', '').replace(',', '.')
                try:
                    usd_rate = float(raw_rate)
                except ValueError:
                    print(f"Error al convertir tasa USD: {raw_rate}")

        # 2. Búsqueda de otras tasas, incluyendo el EUR (euro)
        eur_div = soup.find('div', id='euro')
        if eur_div:
            rate_element = eur_div.find('strong')
            if rate_element:
                raw_rate = rate_element.text.strip().replace('.', '').replace(',', '.')
                try:
                    eur_rate = float(raw_rate)
                except ValueError:
                    print(f"Error al convertir tasa EUR (ID): {raw_rate}")
        
        # Fallback: Búsqueda en filas si no se encontró por ID
        if eur_rate is None:
            row_elements = soup.find_all('div', class_='row')
            for row in row_elements:
                text = row.text.strip()
                if 'EUR' in text and 'USD' not in text:
                    value_span = row.find_all('strong')
                    if not value_span:
                        value_span = row.find_all('span', class_='text-right')
                    
                    if value_span:
                        raw_rate = value_span[-1].text.strip().replace('.', '').replace(',', '.')
                        try:
                            eur_rate = float(raw_rate)
                        except ValueError:
                            pass
                        break

        if usd_rate is None and eur_rate is None:
             # Just return None if failed, let the caller handle it or use caching
             print("Warning: Could not scrape rates.")
             return None

        return {
            "USD": round(usd_rate, 4) if usd_rate else None,
            "EUR": round(eur_rate, 4) if eur_rate else None,
            "date": datetime.now().isoformat()
        }

    except Exception as e:
        print(f"Error scraping BCV: {e}")
        return None
