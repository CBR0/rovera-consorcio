"use client";

import { useState } from "react";

interface SimulationFormProps {
  initialNome?: string;
  initialEmail?: string;
}

export default function SimulationForm({ initialNome = "", initialEmail = "" }: SimulationFormProps) {
  const [formData, setFormData] = useState({
    nome: initialNome,
    email: initialEmail,
    telefone: "",
    valorDesejado: "",
    parcelas: "60",
  });

  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    telefone: false,
    valorDesejado: false,
  });

  const [errors, setErrors] = useState({
    nome: "",
    email: "",
    telefone: "",
    valorDesejado: "",
  });

  // Função para formatar telefone (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers.length <= 2) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // Função para formatar valor em moeda R$ XX.XXX,XX
  const formatCurrency = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    if (numbers === "") return "";
    const formatted = (parseInt(numbers, 10) / 100).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
    return formatted;
  };

  // Funções de validação
  const validateNome = (value: string) => {
    if (!value.trim()) return "Nome é obrigatório";
    if (value.trim().length < 3) return "Nome deve ter pelo menos 3 caracteres";
    return "";
  };

  const validateEmail = (value: string) => {
    if (!value.trim()) return "E-mail é obrigatório";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "E-mail inválido";
    return "";
  };

  const validateTelefone = (value: string) => {
    if (!value.trim()) return ""; // Telefone é opcional
    const numbers = value.replace(/\D/g, "");
    if (numbers.length < 11) return "Telefone inválido";
    return "";
  };

  const validateValorDesejado = (value: string) => {
    if (!value.trim()) return "Valor desejado é obrigatório";
    const numbers = value.replace(/\D/g, "");
    const valor = parseInt(numbers, 10) / 100;
    if (valor < 100) return "Valor mínimo é R$ 100,00";
    return "";
  };

  // Validar todos os campos
  const validateForm = () => {
    const newErrors = {
      nome: validateNome(formData.nome),
      email: validateEmail(formData.email),
      telefone: validateTelefone(formData.telefone),
      valorDesejado: validateValorDesejado(formData.valorDesejado),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched({ ...touched, [field]: true });
    let error = "";
    switch (field) {
      case "nome":
        error = validateNome(formData.nome);
        break;
      case "email":
        error = validateEmail(formData.email);
        break;
      case "telefone":
        error = validateTelefone(formData.telefone);
        break;
      case "valorDesejado":
        error = validateValorDesejado(formData.valorDesejado);
        break;
    }
    setErrors({ ...errors, [field]: error });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Marcar todos os campos como touched
    setTouched({
      nome: true,
      email: true,
      telefone: true,
      valorDesejado: true,
    });

    if (!validateForm()) {
      return;
    }

    // Converter valores formatados para números antes de enviar
    const submissionData = {
      ...formData,
      telefone: formData.telefone.replace(/\D/g, ""),
      valorDesejado: formData.valorDesejado.replace(/\D/g, ""),
    };
    console.log("Dados do formulário:", submissionData);
    alert("Simulação enviada com sucesso! (Dados no console)");
    // Aqui futuramente será a conexão com o banco de dados
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "telefone") {
      setFormData({ ...formData, telefone: formatPhone(value) });
    } else if (name === "valorDesejado") {
      setFormData({ ...formData, valorDesejado: formatCurrency(value) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const parcelasOptions = [12, 48, 60, 72, 84, 96, 120];
  const parcelasIndex = parcelasOptions.indexOf(parseInt(formData.parcelas));

  const getInputClassName = (field: keyof typeof touched) => {
    const baseClassName = "w-full px-3 py-2 rounded-md focus:outline-none text-white placeholder-gray-500 transition-colors";
    const hasError = touched[field] && errors[field];
    if (hasError) {
      return `${baseClassName} bg-zinc-800 border-2 border-red-500 focus:ring-0 focus:border-red-500`;
    }
    return `${baseClassName} bg-zinc-800 border border-zinc-700 focus:ring-2 focus:ring-rovera-primary`;
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 rounded-lg shadow-md mt-8 w-full max-w-md bg-zinc-900/80 border border-zinc-800">
      <h2 className="text-2xl mb-3 font-bold text-center text-white font-display tracking-wide">Simular consórcio</h2>
      <p className="mb-6 text-md text-center">Você está a um passo de realizar os seus sonhos, faça uma simulação e descubra como!</p>

      <div className="mb-4">
        <label htmlFor="nome" className="block text-sm font-medium text-gray-300 mb-2">
          Nome Completo
        </label>
        <input
          type="text"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          onBlur={() => handleBlur("nome")}
          className={getInputClassName("nome")}
          placeholder="Seu nome completo"
        />
        {touched.nome && errors.nome && (
          <p className="text-red-500 text-xs mt-1">{errors.nome}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
          E-mail
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={() => handleBlur("email")}
          className={getInputClassName("email")}
          placeholder="seu@email.com"
        />
        {touched.email && errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="telefone" className="block text-sm font-medium text-gray-300 mb-2">
          Telefone
        </label>
        <input
          type="tel"
          id="telefone"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
          onBlur={() => handleBlur("telefone")}
          maxLength={15}
          className={getInputClassName("telefone")}
          placeholder="(00) 00000-0000"
        />
        {touched.telefone && errors.telefone && (
          <p className="text-red-500 text-xs mt-1">{errors.telefone}</p>
        )}
      </div>

      <div className="mb-4">
        <label htmlFor="valorDesejado" className="block text-sm font-medium text-gray-300 mb-2">
          Valor Desejado (mínimo R$ 100,00)
        </label>
        <input
          type="text"
          id="valorDesejado"
          name="valorDesejado"
          value={formData.valorDesejado}
          onChange={handleChange}
          onBlur={() => handleBlur("valorDesejado")}
          className={getInputClassName("valorDesejado")}
          placeholder="R$ 0,00"
        />
        {touched.valorDesejado && errors.valorDesejado && (
          <p className="text-red-500 text-xs mt-1">{errors.valorDesejado}</p>
        )}
      </div>

      <div className="mb-6">
        <label htmlFor="parcelas" className="block text-sm font-medium text-gray-300 mb-2">
          Número de Parcelas: <span className="text-rovera-primary font-bold">{formData.parcelas} meses</span>
        </label>
        <div className="relative">
          <input
            type="range"
            id="parcelas"
            name="parcelas"
            value={parcelasIndex}
            onChange={(e) => setFormData({ ...formData, parcelas: parcelasOptions[parseInt(e.target.value)].toString() })}
            min="0"
            max={parcelasOptions.length - 1}
            step="1"
            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-rovera-primary"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>12</span>
            <span>48</span>
            <span>60</span>
            <span>72</span>
            <span>84</span>
            <span>96</span>
            <span>120</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="group flex items-center justify-center gap-3 px-8 py-3 rounded-[10px] h-[40px] -skew-x-12 border border-rovera-primary text-rovera-primary tracking-wider hover:bg-rovera-primary hover:text-black transition-all duration-300 w-full font-display text-xl"
      >
        <span className="skew-x-12">simular agora</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 group-hover:translate-x-1 transition-transform skew-x-12"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
        </svg>
      </button>
    </form>
  );
}
