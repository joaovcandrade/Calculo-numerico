import streamlit as st
import numpy as np
import pandas as pd

class Representacao:

    def __init__(self, base, mantissa, exp_min, exp_max):
        self.base = base
        self.mantissa = mantissa
        self.exp_min = exp_min
        self.exp_max = exp_max
        self.maior_expoente = 0

    def limpar_maior_expoente(self):
        self.maior_expoente = 0


    def normalizar(self,valor):
        #Conversão dos valores
        valor = float(valor) #traz para float

        int_part = int(valor) #Parte inteira (antes da virgula)

        #Caso a parte inteira não seja [0,...], normalizar  
        valor_expoente = 0   
        if(int_part != 0):
            valor_expoente = len(str(int_part)) #Quantas casas decimais parte inteira
            #Caso o meu expoente atual seja menor que o maior expoente informado, normaliza
            if(self.maior_expoente > valor_expoente):
                valor = valor*10**(-self.maior_expoente) #Transforma o valor para o maior expoente
                #Realiza movimento a base para voltar as casas decimais
                
            
            else:
                valor = valor * 10**-valor_expoente #Realiza movimento a base para voltar as casas decimais
                self.maior_expoente = valor_expoente #Atualiza o maior expoente
        
        st.write('exp ' + str(self.maior_expoente) + " " + str(valor_expoente))
        st.write(float(('%f' % valor)[:2+self.mantissa]))
        return float(('%f' % valor)[:2+self.mantissa]) #Retorna o valor normalizado


st.title('Cálculo numérico')

repr = Representacao(10,4,-5,5)

n = 10
x = 3

repr.limpar_maior_expoente()

soma = 0.0
for _ in range(1,n):

    soma = repr.normalizar(soma) + repr.normalizar(x)
    st.write(soma)
    

s =  soma + repr.normalizar(42450)

repr.limpar_maior_expoente()
st.write(s*10**repr.maior_expoente)




