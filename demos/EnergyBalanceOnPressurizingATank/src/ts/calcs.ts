/**
 * ****** Energy balance with water: ******
 *      m_1 U_1 + m_2 H_2 = (m_1 + m_2) U_final
 * where
 *      q_1 = ((V_1/m_1) - V_1,l) / (V_1,v - V_1,l)
 *      U_1 = q_1 U_1,v + (1-q_1) U_1,l
 * thus,
 *      q_f = (V_1 / (m_1 + m_2) - V_2,l) / (V_2,v - V_2,l)
 *      U_f = q_f U_2,v + (1 - q_f) U_2,l
 * 
 * Final temp is saturation temp at final pressure (P final === P2)
 * 
 */