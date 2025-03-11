import { useEffect, useState, ChangeEvent } from "react";

// Tipagem para moedas suportadas
type Currency = "USD" | "EUR" | "CAD" | "INR" | "BRL";

// Interface para a resposta da API
interface ConversionResponse {
  amount: number;
  base: Currency;
  date: string;
  rates: {
    [key in Currency]?: number;
  };
}

function App() {
  // Estados para o formulário
  const [formAmount, setFormAmount] = useState<number>(1);
  const [formFromCur, setFormFromCur] = useState<Currency>("EUR");
  const [formToCur, setFormToCur] = useState<Currency>("USD");
  
  // Estados para a conversão
  const [amount, setAmount] = useState<number>(1);
  const [fromCur, setFromCur] = useState<Currency>("EUR");
  const [toCur, setToCur] = useState<Currency>("USD");
  const [converted, setConverted] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    async function convert() {
      setIsLoading(true);
      try {
        // Se as moedas forem iguais, não precisamos fazer a chamada API
        if (fromCur === toCur) {
          setConverted(amount);
          setIsLoading(false);
          return;
        }

        const res = await fetch(
          `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCur}&to=${toCur}`
        );

        const data: ConversionResponse = await res.json();
        setConverted(data.rates[toCur] || 0);
      } catch (error) {
        console.error("Erro na conversão:", error);
        setConverted("Erro na conversão");
      } finally {
        setIsLoading(false);
      }
    }

    convert();
  }, [fromCur, toCur, amount]); // Remova isLoading das dependências

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFormAmount(value === "" ? 0 : Number(value));
  };

  const handleCurrencyChange = (
    e: ChangeEvent<HTMLSelectElement>,
    setter: (currency: Currency) => void
  ) => {
    setter(e.target.value as Currency);
  };

  // Handler para o botão Converter
  const handleUpdateClick = () => {
    // Atualize os estados de conversão com os valores do formulário
    setAmount(formAmount);
    setFromCur(formFromCur);
    setToCur(formToCur);
  };

  return (
    <div>
      <h1 className="text-3xl text-left font-bold text-red-500 underline uppercase">
        CURRENCY CONVERTER
      </h1>
      <input
        className="text-3xl border-2 border-gray-300 p-2 w-1/4 mx-auto mt-4 "
        type="text"
        value={formAmount}
        onChange={handleAmountChange}
        disabled={isLoading}
      />
      <select
        name="from-currency"
        id="from-currency"
        className="text-3xl border-2 border-gray-300 p-2 w-1/8 mx-auto mt-4"
        onChange={(e) => handleCurrencyChange(e, setFormFromCur)}
        value={formFromCur}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="BRL">BRL</option>
      </select>
      <select
        name="to-currency"
        id="to-currency"
        className="text-3xl border-2 border-gray-300 p-2 w-1/8 mx-auto mt-4"
        onChange={(e) => handleCurrencyChange(e, setFormToCur)}
        value={formToCur}
        disabled={isLoading}
      >
        <option value="USD">USD</option>
        <option value="EUR">EUR</option>
        <option value="CAD">CAD</option>
        <option value="INR">INR</option>
        <option value="BRL">BRL</option>
      </select>
      <p className="text-3xl text-left mt-4">
        {converted} {toCur}
      </p>
      <button 
        className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-300"
        onClick={handleUpdateClick}
        disabled={isLoading}
      >
        {isLoading ? "CONVERTENDO..." : "CONVERTER"}
      </button>
    </div>
  );
}

export default App;
