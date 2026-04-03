import { useEffect, useRef } from 'react';

const BarChart = ({ data = [], comparing = [], swapping = [], maxValue = 100 }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const targetDataRef = useRef(data);
  const currentDataRef = useRef(data);
  const animatingRef = useRef(false);

  
  const drawBars = (currentData, comparingArr, swappingArr) => {
    const canvas = canvasRef.current;
    if (!canvas || !currentData || !currentData.length) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const barWidth = Math.max(8, width / currentData.length - 8);
    
    ctx.clearRect(0, 0, width, height);
    
    
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, width, height);
    
    
    ctx.strokeStyle = 'rgba(0, 255, 157, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = height - (i * height / 4);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    currentData.forEach((value, index) => {
      const barHeight = (value / maxValue) * height;
      const x = index * (barWidth + 8);
      const y = height - barHeight;
      
      let gradient;
      if (comparingArr && comparingArr.includes(index)) {
        gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
        gradient.addColorStop(0, '#fbbf24');
        gradient.addColorStop(1, '#f59e0b');
      } else if (swappingArr && swappingArr.includes(index)) {
        gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
        gradient.addColorStop(0, '#f87171');
        gradient.addColorStop(1, '#ef4444');
      } else {
        gradient = ctx.createLinearGradient(x, y, x + barWidth, y + barHeight);
        gradient.addColorStop(0, '#00ff9d');
        gradient.addColorStop(1, '#10b981');
      }
      
      ctx.fillStyle = gradient;
      ctx.fillRect(x, y, barWidth, barHeight);
      
      ctx.strokeStyle = 'rgba(0, 255, 157, 0.5)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, barWidth, barHeight);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px monospace';
      ctx.fillText(Math.round(value), x + barWidth / 3, y - 8);
      
      
      ctx.fillStyle = 'rgba(0, 255, 157, 0.6)';
      ctx.font = '10px monospace';
      ctx.fillText(index, x + barWidth / 3, height - 5);
    });
  };

  
  useEffect(() => {
    targetDataRef.current = data;
    
    if (!animatingRef.current && currentDataRef.current) {
      animatingRef.current = true;
      
      const animate = () => {
        let changed = false;
        const newData = [...currentDataRef.current];
        
        for (let i = 0; i < newData.length; i++) {
          const target = targetDataRef.current[i];
          const current = newData[i];
          const diff = target - current;
          
          if (Math.abs(diff) > 0.5) {
            newData[i] = current + diff * 0.3;
            changed = true;
          } else {
            newData[i] = target;
          }
        }
        
        currentDataRef.current = newData;
        drawBars(currentDataRef.current, comparing, swapping);
        
        if (changed) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          animatingRef.current = false;
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [data, comparing, swapping]);

  
  useEffect(() => {
    if (currentDataRef.current && currentDataRef.current.length) {
      drawBars(currentDataRef.current, comparing, swapping);
    }
  }, [comparing, swapping]);

  
  useEffect(() => {
    currentDataRef.current = [...data];
    drawBars(data, comparing, swapping);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ width: '100%', height: '400px', borderRadius: '12px' }}
    />
  );
};

export default BarChart;
