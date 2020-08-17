document.querySelector("#aplicar").addEventListener('click', (e)=>{
  e.preventDefault();
  x = document.querySelector("#x").value;
  n = document.querySelector("#n").value;
  if(document.querySelector("#truncamento").checked){
    tipo = "truncar"
  }else{
    tipo = "arredondar"
  }
  entrada = `10000 - #somatorio(${x}, 1, ${n})#`
  resultado = calcular(entrada, tipo)
  document.querySelector("#resolucao").innerText = resultado[1]
  document.querySelector("#botaoResultado").style.display = "inline"
  document.querySelector("#resultado").innerText = resultado[0]
})



function calcular(entrada, tipo){
  //procura o marcador, se  não existe retorna -1 e pula o if
  if(entrada.indexOf("#") != -1){

    //Enquanto ainda existir marcadores, faça:
    while(entrada.indexOf("#") != -1){

      //encontra o primeiro marcador
      const inicio_marcador = entrada.indexOf("#")
      //e o fim deste primeiro marcador com base no index dele
      const fim_marcador = entrada.indexOf("#", inicio_marcador+1)


      //Chama o metodo que vai transformar o comando em string
      executado = executa_comando(entrada.slice(inicio_marcador+1,fim_marcador))
      
      //Recorta o comando e poe a string do comando executado
      anterior = entrada.slice(0,inicio_marcador) 
      posterior = entrada.slice(fim_marcador+1)
      entrada = anterior + executado + posterior

    }
  }
  return realizar_operacao(entrada, tipo, 4)
}




function truncar(valor, mantissa){
  
  if(!(valor.split('.')[1].length <= mantissa)){

    split = valor.split('.')
    split[1] = split[1].slice(0,mantissa)
    split = split.join('.')
    return split
  }else{
    return valor
  }

}

function arredondar(valor, mantissa){

  if(!(valor.split('.')[1].length <= mantissa)){
    
    split = valor.split('.')

    ultimo_valor_mantissa = split[1].charAt(mantissa)
    ultimo_valor = split[1].charAt(mantissa)

    split[1] = split[1].slice(0,mantissa)
    
    if(ultimo_valor_mantissa >= 5){
      split[1] += (parseInt(ultimo_valor) + 1).toString()
    }
    
    split = split.join('.')
    return split
  
  }else{

    return valor
    
  }

}

function realizar_operacao(operacao, tipo, mantissa){
  memoria = []
  operacoes = operacao.split(" ")
  
  
  for (i=0; i < operacoes.length; i++){
    if(!isNaN(operacoes[i])){
      operacoes[i] += "[0]"
    }
  }

  calculado = operacoes[0]

  for (i=0; i < operacoes.length; i++){

    if(isNaN(operacoes[i].split('[')[0])){
      valores = []

      let v0 = []
      split_0 = (calculado.split('['))
      v0.push(split_0[0])
      v0.push(split_0[1].split(']')[0])
      
      let v1 = []
      split_1 = (operacoes[i+1].split('['))
      v1.push(split_1[0])
      v1.push(split_1[1].split(']')[0])
      
      valores.push(v0)
      valores.push(v1)


  

      //normalizar_ valor 1 e 2
      for (j = 0; j < 2; j++){
        if(valores[j][0].indexOf("0.") != 0){

          deslocamento = 0
          split = valores[j][0].split(".")
  
          if(split.length == 1){
  
            valores[j][0] = '0.'+ valores[j][0]
            deslocamento += split[0].length

  
          }else{

            deslocamento = split[0].length
            valores[j][0] = '0.' + split[0] + split[1]
  
          }
  
          valores[j][1] = (parseInt(valores[j][1]) + deslocamento).toString()
        }
      }


      //converter mai0r expoente
      if (valores[0][1] > valores[1][1]){

        //
        diferenca = valores[0][1] - valores[1][1]
        
        //Quantos zeros vai adicionar
        zeros = '' 
        for(j=0; j<diferenca; j++){
          zeros += '0'
        }

        //Acrescenta os zeros na frente
        split = valores[1][0].split('.')
        split[1] = zeros + split[1]
        valores[1][0] = split.join('.')

        //atualiza o expoente do menor valor
        valores[1][1] = valores[0][1]

        if(tipo == 'truncar'){
          valores[1][0] = truncar(valores[1][0], mantissa)
        }else{
          valores[1][0] = arredondar(valores[1][0], mantissa)
        }
        

      }else if(valores[1][1] > valores[0][1]){

        //
        diferenca = valores[1][1] - valores[0][1]
        
        //Quantos zeros vai adicionar
        zeros = '' 
        for(j=0; j<diferenca; j++){
          zeros += '0'
      }

        //Acrescenta os zeros na frente
        split = valores[0][0].split('.')
        split[1] = zeros + split[1]
        valores[0][0] = split.join('.')

        //atualiza o expoente do menor valor
        valores[0][1] = valores[1][1]

        if(tipo == 'truncar'){
          valores[0][0] = truncar(valores[0][0], mantissa)
        }else{
          valores[0][0] = arredondar(valores[0][0], mantissa)
        }

      }
      if(operacoes[i] == '+'){
        calculo = parseFloat(valores[0][0]) + parseFloat(valores[1][0])
      }else if(operacoes[i] == '-'){
        calculo = parseFloat(valores[0][0]) - parseFloat(valores[1][0])
      }
      calculado = calculo.toString() + '['+valores[0][1]+']'
      
      
      memoria.push(valores[0][0]+'X10^'+ valores[0][1] + ` ${operacoes[i]} ` + valores[1][0]+'X10^'+ valores[1][1] +' = ' + calculo.toString()+'X10^'+valores[0][1]+"\n")
    }
    
  }
  return [calculado.split("[").join(" X 10^").split("]").join("") + `${ ((calculado.split('[')[1].split(']')[0] > 5)? ' overflow' : '' )} ${(calculado.split('[')[1].split(']')[0] < -5)? ' underflow' : ''}`, memoria]

}




function executa_comando(comando){
    inicio_marcador = comando.indexOf("(")
    fim_marcador = comando.indexOf(")", inicio_marcador)
    parametros = comando.slice(inicio_marcador+1,fim_marcador)
    
    parametros = parametros.split(',')
    
    x =  parametros[0]
    k = parametros[1]
    n = parametros[2]
  
    saida = ''
    for (i=k; i<=n; i++){
        saida += x + ' + '
    }
      
    

    saida = saida.slice(0,-3) //somatorio sem o ' + ' final
    return saida
}



