using Microsoft.EntityFrameworkCore;

namespace Payment_GateWay.Model
{
    public class PaymentDetailContext : DbContext
    {
        public PaymentDetailContext(DbContextOptions options) : base(options)
            {

            }

        public DbSet<PaymentDetail> PaymentDetails { get; set; }
    }

}
