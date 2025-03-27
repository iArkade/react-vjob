export const formatLoginDate = (timestamp: string | number | Date): string => {
     const date = new Date(timestamp);

     const time = date.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
     });

     const datePart = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
     });

     return `${time} ${datePart}`;
};