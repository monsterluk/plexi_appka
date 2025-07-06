import { CustomerData } from '../components/CustomerForm/CustomerForm';

interface QuoteData {
  customer: CustomerData;
  product: {
    name: string;
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    quantity: number;
    options: any;
  };
  pricing: {
    materialCost: number;
    additionalCosts: Array<{ name: string; cost: number }>;
    totalCost: number;
  };
  quoteNumber: string;
  validUntil: Date;
}

export class PDFGenerator {
  static generateQuote(data: QuoteData): void {
    // Tworzymy HTML do wydruku
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Oferta ${data.quoteNumber}</title>
        <style>
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
          
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          
          .header {
            display: flex;
            justify-content: space-between;
            align-items: start;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid #2196f3;
          }
          
          .company-info h1 {
            color: #2196f3;
            margin: 0;
            font-size: 28px;
          }
          
          .company-info p {
            margin: 5px 0;
            color: #666;
          }
          
          .quote-info {
            text-align: right;
          }
          
          .quote-info h2 {
            margin: 0;
            color: #333;
            font-size: 24px;
          }
          
          .quote-info p {
            margin: 5px 0;
            color: #666;
          }
          
          .customer-section {
            background: #f5f5f5;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          
          .customer-section h3 {
            margin-top: 0;
            color: #333;
          }
          
          .product-section {
            margin-bottom: 30px;
          }
          
          .product-section h3 {
            color: #333;
            border-bottom: 1px solid #ddd;
            padding-bottom: 10px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          
          th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          
          th {
            background: #f5f5f5;
            font-weight: 600;
            color: #333;
          }
          
          .pricing-table td:last-child,
          .pricing-table th:last-child {
            text-align: right;
          }
          
          .total-row {
            font-weight: bold;
            font-size: 18px;
            background: #e3f2fd;
          }
          
          .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          
          .specifications {
            background: #f9f9f9;
            padding: 15px;
            border-radius: 4px;
            margin: 15px 0;
          }
          
          .specifications h4 {
            margin-top: 0;
            color: #555;
          }
          
          .specifications ul {
            margin: 10px 0;
            padding-left: 20px;
          }
          
          .specifications li {
            margin: 5px 0;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="company-info">
            <h1>PLEXI PRODUCENT</h1>
            <p>ul. Przykładowa 123</p>
            <p>00-000 Warszawa</p>
            <p>Tel: +48 123 456 789</p>
            <p>Email: biuro@plexiproducent.pl</p>
          </div>
          <div class="quote-info">
            <h2>OFERTA</h2>
            <p><strong>Nr:</strong> ${data.quoteNumber}</p>
            <p><strong>Data:</strong> ${new Date().toLocaleDateString('pl-PL')}</p>
            <p><strong>Ważna do:</strong> ${data.validUntil.toLocaleDateString('pl-PL')}</p>
          </div>
        </div>
        
        <div class="customer-section">
          <h3>Dane klienta</h3>
          <p><strong>${data.customer.companyName}</strong></p>
          <p>${data.customer.contactPerson}</p>
          ${data.customer.address ? `<p>${data.customer.address}</p>` : ''}
          ${data.customer.nip ? `<p>NIP: ${data.customer.nip}</p>` : ''}
          <p>Tel: ${data.customer.phone}</p>
          <p>Email: ${data.customer.email}</p>
        </div>
        
        <div class="product-section">
          <h3>Specyfikacja produktu</h3>
          
          <div class="specifications">
            <h4>${data.product.name}</h4>
            <ul>
              <li>Wymiary: ${data.product.dimensions.width} x ${data.product.dimensions.height} x ${data.product.dimensions.depth} mm</li>
              <li>Ilość: ${data.product.quantity} szt.</li>
              ${this.generateOptionsHTML(data.product.options)}
            </ul>
          </div>
          
          <table class="pricing-table">
            <thead>
              <tr>
                <th>Pozycja</th>
                <th>Kwota netto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Koszt materiału</td>
                <td>${this.formatPrice(data.pricing.materialCost)}</td>
              </tr>
              ${data.pricing.additionalCosts.map(cost => `
                <tr>
                  <td>${cost.name}</td>
                  <td>${this.formatPrice(cost.cost)}</td>
                </tr>
              `).join('')}
              <tr class="total-row">
                <td>RAZEM NETTO</td>
                <td>${this.formatPrice(data.pricing.totalCost)}</td>
              </tr>
              <tr class="total-row">
                <td>RAZEM BRUTTO (23% VAT)</td>
                <td>${this.formatPrice(data.pricing.totalCost * 1.23)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <div class="footer">
          <p>Oferta ważna ${this.getDaysUntil(data.validUntil)} dni od daty wystawienia.</p>
          <p>Termin realizacji: 7-14 dni roboczych od akceptacji zamówienia.</p>
          <p>Warunki płatności: przelew 14 dni.</p>
        </div>
      </body>
      </html>
    `;

    // Otwieramy nowe okno z podglądem do wydruku
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(html);
      printWindow.document.close();
      
      // Czekamy na załadowanie i drukujemy
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  }

  private static formatPrice(price: number): string {
    return price.toLocaleString('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  private static getDaysUntil(date: Date): number {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  private static generateOptionsHTML(options: any): string {
    const items: string[] = [];
    
    // Przykładowe opcje dla Impulsu Kasowego
    if (options.plexiType) {
      items.push(`<li>Rodzaj plexi: ${options.plexiType === 'clear' ? 'bezbarwna' : 'biała'}</li>`);
    }
    if (options.thickness) {
      items.push(`<li>Grubość: ${options.thickness} mm</li>`);
    }
    if (options.shelvesCount) {
      items.push(`<li>Liczba półek: ${options.shelvesCount}</li>`);
    }
    if (options.graphics?.enabled) {
      items.push(`<li>Grafika: ${options.graphics.type === 'single' ? 'jednostronna' : 'dwustronna'}</li>`);
    }
    
    return items.join('');
  }

  // Metoda do zapisywania oferty w localStorage
  static saveQuote(data: QuoteData): void {
    const quotes = this.getSavedQuotes();
    quotes.push({
      ...data,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem('savedQuotes', JSON.stringify(quotes));
  }

  static getSavedQuotes(): any[] {
    const saved = localStorage.getItem('savedQuotes');
    return saved ? JSON.parse(saved) : [];
  }

  static deleteQuote(quoteNumber: string): void {
    const quotes = this.getSavedQuotes();
    const filtered = quotes.filter(q => q.quoteNumber !== quoteNumber);
    localStorage.setItem('savedQuotes', JSON.stringify(filtered));
  }
}