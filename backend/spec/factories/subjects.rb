FactoryBot.define do
  factory :subject do
    course { nil }
    title { "MyString" }
    description { "MyText" }
    order { 1 }
  end
end
