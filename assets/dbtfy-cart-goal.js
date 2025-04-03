if (!customElements.get('dbtfy-cart-goal')) {
  customElements.define(
    'dbtfy-cart-goal',
    class CartGoal extends HTMLElement {
      constructor() {
        super();

        this.goals = Fastify.widgets['cart_goals']['global'];

        if (Fastify.widgets['cart_goals'][Shopify.country]) {
          this.goals = Fastify.widgets['cart_goals'][Shopify.country];
        }

        this.all_goals_reached = false;
        this.current_goal = null;

        this.goalMessage = this.querySelector('.dbtfy-cart-goal--message');

        setTimeout(() => {
          this.cartTotal = Fastify.cart.total_price / 100;
          this.init();
        }, 1000);
      }

      init() {
        if (!this.goals.length) {
          return;
        }

        const message = this.displayGoalMessage(this.cartTotal);

        let progress_percentage = (this.cartTotal * 100) / this.current_goal.goal_amount;
        let progress_color = this.current_goal.goal_reached_before_color;
        if (progress_percentage > 100) {
          progress_percentage = 100;
          progress_color = this.current_goal.goal_reached_after_color;
        }

        this.style.setProperty('--dbtfy-cart-goal-percenatge', `${progress_percentage}%`);
        this.style.setProperty('--dbtfy-cart-goal-progresscolor', progress_color);
        this.goalMessage.innerHTML = message;

        this.removeAttribute('hidden');
      }

      displayGoalMessage(cartTotal) {
        const goals = this.goals;
        const sortedGoals = goals.sort((a, b) => a.goal_amount - b.goal_amount);

        for (let i = 0; i < sortedGoals.length; i++) {
          if (cartTotal >= sortedGoals[i].goal_amount) {
            if (i === sortedGoals.length - 1) {
              this.current_goal = sortedGoals[i];
              return this.current_goal.cart_goal_success_text;
            }

            const nextGoal = sortedGoals[i + 1];
            this.current_goal = nextGoal;

            if (cartTotal > nextGoal.goal_amount) {
              this.all_goals_reached = true;
              return nextGoal.cart_goal_success_text;
            }
            const amount = nextGoal.goal_amount - cartTotal;
            return nextGoal.cart_goal_text.replace('{amount}', `${Fastify.currency.symbol}${amount.toFixed(2)}`);
          }
        }

        this.current_goal = sortedGoals[0];
        const sortgoalAmount = sortedGoals[0].goal_amount - cartTotal;

        return sortedGoals[0].cart_goal_text.replace(
          '{amount}',
          `${Fastify.currency.symbol}${sortgoalAmount.toFixed(2)}`
        );
      }
    }
  );
}
