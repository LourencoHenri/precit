import { Product } from '@/types/product';

// TODO: replace with real data from database/API
export const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Bolsa Artesanal',
    description: 'Bolsa feita à mão com couro legítimo e costuras reforçadas',
    finalPrice: 150.0,
  },
  {
    id: '2',
    name: 'Vela Aromática',
    description: 'Vela de soja com essência de lavanda e madeira de cedro',
    finalPrice: 35.0,
  },
  {
    id: '3',
    name: 'Sabonete Natural',
    description: 'Sabonete artesanal com ingredientes naturais e manteiga de karité',
    finalPrice: 18.0,
  },
  {
    id: '4',
    name: 'Colar de Macramê',
    description: 'Colar trançado à mão com pedra natural e fio de algodão',
    finalPrice: 55.0,
  },
  {
    id: '5',
    name: 'Almofada Bordada',
    description: 'Almofada com bordado floral artesanal em linho importado',
    finalPrice: 89.0,
  },
];
